
-- Function: api.rate
-- Description: Updates the user's rating history and the movie's average rating.
-- Requirements: 1-D.3 Title rating

CREATE OR REPLACE FUNCTION api.rate(
    p_title_id UUID,
    p_rating INT,
    p_account_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- 1. Validate input
    IF p_rating < 1 OR p_rating > 10 THEN
        RAISE EXCEPTION 'Rating must be between 1 and 10';
    END IF;

    -- 2. Update Profile Framework (User's Rating History)
    -- Using the existing logic from api.add_rating but inlined or called
    INSERT INTO profile.rating_history (account_id, title_id, rating, created_at)
    VALUES (p_account_id, p_title_id, p_rating, now())
    ON CONFLICT (account_id, title_id)
    DO UPDATE SET 
        rating = EXCLUDED.rating,
        created_at = now();

    -- 3. Update Movie Data Model (Raw User Rating)
    INSERT INTO movie_db.user_rating (account_id, title_id, rating)
    VALUES (p_account_id, p_title_id, p_rating)
    ON CONFLICT (account_id, title_id)
    DO UPDATE SET rating = EXCLUDED.rating;

    -- 4. Recalculate and Update Average Rating
    INSERT INTO movie_db.rating (title_id, average_rating, num_votes)
    SELECT 
        ur.title_id, 
        AVG(ur.rating)::DOUBLE PRECISION, 
        COUNT(*)::INT
    FROM movie_db.user_rating ur
    WHERE ur.title_id = p_title_id
    GROUP BY ur.title_id
    ON CONFLICT (title_id) DO UPDATE
    SET average_rating = EXCLUDED.average_rating,
        num_votes      = EXCLUDED.num_votes;

END;
$$;
