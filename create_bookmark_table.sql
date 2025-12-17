CREATE TABLE IF NOT EXISTS profile.bookmark (
    id UUID PRIMARY KEY,
    account_id UUID NOT NULL,
    title_id UUID,
    person_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_bookmark_account FOREIGN KEY (account_id) REFERENCES profile.account(id) ON DELETE CASCADE,
    CONSTRAINT fk_bookmark_title FOREIGN KEY (title_id) REFERENCES movie_db.title(id) ON DELETE CASCADE,
    CONSTRAINT fk_bookmark_person FOREIGN KEY (person_id) REFERENCES movie_db.person(id) ON DELETE CASCADE,
    CONSTRAINT chk_bookmark_target CHECK (
        (title_id IS NOT NULL AND person_id IS NULL) OR 
        (title_id IS NULL AND person_id IS NOT NULL)
    ),
    CONSTRAINT uq_bookmark_title UNIQUE (account_id, title_id),
    CONSTRAINT uq_bookmark_person UNIQUE (account_id, person_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookmark_account_id ON profile.bookmark(account_id);
CREATE INDEX IF NOT EXISTS idx_bookmark_title_id ON profile.bookmark(title_id);
CREATE INDEX IF NOT EXISTS idx_bookmark_person_id ON profile.bookmark(person_id);
