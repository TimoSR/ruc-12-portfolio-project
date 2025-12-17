BEGIN;

-- Create dummy user
INSERT INTO profile.account (id, email, username, password_hash)
VALUES ('00000000-0000-0000-0000-000000000001', 'test@test.com', 'testuser', 'hash')
ON CONFLICT DO NOTHING;

-- Create dummy title
INSERT INTO movie_db.title (id, legacy_id, title_type, primary_title, is_adult)
VALUES ('00000000-0000-0000-0000-000000000002', 'tt0000001', 'movie', 'Test Movie', false)
ON CONFLICT DO NOTHING;

-- Call rate
SELECT api.rate('00000000-0000-0000-0000-000000000002', 8, '00000000-0000-0000-0000-000000000001');

-- Verify profile.rating_history
DO $$
DECLARE
    r INT;
BEGIN
    SELECT rating INTO r FROM profile.rating_history 
    WHERE account_id = '00000000-0000-0000-0000-000000000001' AND title_id = '00000000-0000-0000-0000-000000000002';
    
    IF r != 8 THEN
        RAISE EXCEPTION 'Profile rating history not updated correctly. Expected 8, got %', r;
    END IF;
END $$;

-- Verify movie_db.rating
DO $$
DECLARE
    avg_r FLOAT;
    votes INT;
BEGIN
    SELECT average_rating, num_votes INTO avg_r, votes FROM movie_db.rating 
    WHERE title_id = '00000000-0000-0000-0000-000000000002';
    
    IF avg_r != 8 OR votes != 1 THEN
        RAISE EXCEPTION 'Movie rating not updated correctly. Expected avg 8, votes 1. Got avg %, votes %', avg_r, votes;
    END IF;
END $$;

RAISE NOTICE 'Test passed!';

ROLLBACK;
