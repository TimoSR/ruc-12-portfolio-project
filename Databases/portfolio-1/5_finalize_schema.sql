-- ============================================
-- DETTE HAR VI IKKE BRUGT IGNORE DET VAR HVAD VI KSULLE HVIS VI KUNNE LAVE ÆNDRINGER PÅ DB
-- ============================================
-- Description:
-- Finalizes the database schema for the portfolio project.
-- Fixes critical type mismatches where Bookmarks and Ratings expected UUIDs
-- but the application uses IMDB IDs (Text, e.g., 'tt1234567').
-- This script replaces the buggy tables from '3_profile_framework.sql'.
-- ============================================

-- 1. CLEANUP: Remove incorrect tables/functions
-- We use CASCADE to automatically remove dependent views/functions.
DROP FUNCTION IF EXISTS api.add_bookmark(UUID, UUID, bookmark_target); -- Old signature (UUID)
DROP FUNCTION IF EXISTS api.add_bookmark(UUID, TEXT, bookmark_target); -- In case of variations
DROP FUNCTION IF EXISTS api.update_bookmark_note(UUID, UUID, bookmark_target, JSONB);
DROP FUNCTION IF EXISTS api.get_bookmarks(UUID, bookmark_target, INT, INT);

DROP FUNCTION IF EXISTS api.add_rating(UUID, UUID, INT, TEXT);
DROP FUNCTION IF EXISTS api.get_ratings_by_account_id(UUID, INT, INT);

DROP TABLE IF EXISTS profile.bookmark CASCADE;
DROP TABLE IF EXISTS profile.rating_history CASCADE;

-- Note: search_history was fine (used TEXT), but we can recreate it to be safe 
-- or leave it. To keep this script focused, we'll only fix the broken ones unless requested.
-- Actually, let's keep it strictly to fixing the broken parts.

-- ============================================
-- 2. CREATE TABLE: BOOKMARK
-- Changes: target_id is now TEXT (was UUID)
-- ============================================
CREATE TABLE profile.bookmark (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES profile.account(id) ON DELETE CASCADE,
    target_id TEXT NOT NULL, -- FIXED: Changed from UUID to TEXT for 'tt...' IDs
    target_type bookmark_target NOT NULL, -- Enum: 'title' or 'person'
    note JSONB,
    added_at TIMESTAMP DEFAULT now(),
    UNIQUE (account_id, target_id, target_type)
);

CREATE INDEX idx_bookmark_account_type_added
ON profile.bookmark (account_id, target_type, added_at DESC);

-- ============================================
-- 3. CREATE TABLE: RATING_HISTORY
-- Changes: title_id is now TEXT (was UUID)
-- ============================================
CREATE TABLE profile.rating_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES profile.account(id) ON DELETE CASCADE,
    title_id TEXT NOT NULL, -- FIXED: Changed from UUID to TEXT for 'tt...' IDs
    rating INT CHECK (rating BETWEEN 1 AND 10),
    comment TEXT,
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE (account_id, title_id)
);

CREATE INDEX idx_rating_history_title
ON profile.rating_history (title_id);

CREATE INDEX idx_rating_history_account_time
ON profile.rating_history (account_id, created_at DESC);

-- ============================================
-- 4. RE-CREATE FUNCTIONS (With correct types)
-- ============================================

-- 4a. Add Bookmark (Updated p_target_id to TEXT)
CREATE OR REPLACE FUNCTION api.add_bookmark(
    p_account_id UUID,
    p_target_id TEXT, -- FIXED
    p_type bookmark_target DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    IF p_type IS NULL THEN
        RAISE EXCEPTION 
          'You must provide a valid bookmark target type (title or person). Options: %', 
          enum_range(NULL::bookmark_target);
    END IF;

    INSERT INTO profile.bookmark (account_id, target_id, target_type)
    VALUES (p_account_id, p_target_id, p_type)
    ON CONFLICT (account_id, target_id, target_type) DO NOTHING;

    IF NOT FOUND THEN
        RAISE NOTICE 'Bookmark already exists. Use api.update_bookmark_note instead.';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 4b. Update Bookmark Note (Updated p_target_id to TEXT)
CREATE OR REPLACE FUNCTION api.update_bookmark_note(
    p_account_id UUID,
    p_target_id TEXT, -- FIXED
    p_type bookmark_target,
    p_note JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE profile.bookmark
    SET note = p_note
    WHERE account_id = p_account_id
      AND target_id = p_target_id
      AND target_type = p_type;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No existing bookmark found.';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 4c. Get Bookmarks (Updated return table target_id to UUID? NO, wait. 
-- If target_id is TEXT in table, it returns TEXT.
-- BUT, in 3_profile_framework.sql it returned UUID.
-- We must return TEXT now.)
CREATE OR REPLACE FUNCTION api.get_bookmarks(
    p_account_id UUID,
    p_type bookmark_target DEFAULT NULL,
    p_limit INT DEFAULT 50,
    p_offset INT DEFAULT 0
) RETURNS TABLE(
    target_id TEXT, -- FIXED: Returns TEXT now
    target_type bookmark_target,
    note JSONB,
    added_at TIMESTAMP
) AS $$
BEGIN
    IF p_type IS NULL THEN
        RETURN QUERY
        SELECT b.target_id, b.target_type, b.note, b.added_at
        FROM profile.bookmark b
        WHERE b.account_id = p_account_id
        ORDER BY b.added_at DESC
        LIMIT p_limit OFFSET p_offset;
    ELSE
        RETURN QUERY
        SELECT b.target_id, b.target_type, b.note, b.added_at
        FROM profile.bookmark b
        WHERE b.account_id = p_account_id
          AND b.target_type = p_type
        ORDER BY b.added_at DESC
        LIMIT p_limit OFFSET p_offset;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 4d. Add Rating (Updated p_title_id to TEXT)
CREATE OR REPLACE FUNCTION api.add_rating(
    p_account_id UUID,
    p_title_id   TEXT,  -- FIXED
    p_rating     INT,
    p_comment    TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO profile.rating_history (account_id, title_id, rating, comment)
    VALUES (p_account_id, p_title_id, p_rating, p_comment)
    ON CONFLICT (account_id, title_id)
    DO UPDATE SET 
        rating     = EXCLUDED.rating,
        comment    = EXCLUDED.comment,
        created_at = now();
END;
$$ LANGUAGE plpgsql;

-- 4e. Get Ratings (Updated return table title_id to TEXT)
CREATE OR REPLACE FUNCTION api.get_ratings_by_account_id(
	p_account_id UUID,
	p_limit INT DEFAULT 50,
	p_offset INT DEFAULT 0
) RETURNS TABLE(
	title_id TEXT, -- FIXED
	rating INT,
	comment TEXT,
	created_at TIMESTAMP
) AS $$
BEGIN
	RETURN QUERY
	SELECT rh.title_id,
		   rh.rating,
		   rh.comment,
		   rh.created_at
	FROM profile.rating_history rh
	WHERE rh.account_id = p_account_id
	ORDER BY rh.created_at DESC
	LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- 4f. Recreate View for Average Ratings (Dependencies might have been dropped)
DROP MATERIALIZED VIEW IF EXISTS api.title_avg_ratings;
CREATE MATERIALIZED VIEW api.title_avg_ratings AS
SELECT title_id, AVG(rating) AS avg_rating, COUNT(*) AS num_ratings
FROM profile.rating_history
GROUP BY title_id;
