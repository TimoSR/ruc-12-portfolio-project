CREATE TABLE IF NOT EXISTS profile.rating_history (
    id UUID PRIMARY KEY,
    account_id UUID NOT NULL,
    title_id UUID NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (account_id) REFERENCES profile.account(id) ON DELETE CASCADE
);

-- Ensure columns exist if table already exists
ALTER TABLE profile.rating_history ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
ALTER TABLE profile.rating_history ADD COLUMN IF NOT EXISTS comment TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_rating_history_account_id ON profile.rating_history(account_id);
