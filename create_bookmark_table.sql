CREATE TABLE IF NOT EXISTS profile.bookmark (
    id UUID PRIMARY KEY,
    account_id UUID NOT NULL,
    target_id TEXT NOT NULL,
    target_type TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_bookmark_account FOREIGN KEY (account_id) REFERENCES profile.account(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS ix_bookmark_account_id ON profile.bookmark(account_id);
CREATE INDEX IF NOT EXISTS ix_bookmark_target ON profile.bookmark(account_id, target_id, target_type);
