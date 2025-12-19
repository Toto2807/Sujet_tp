CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS users (
    id         SERIAL       PRIMARY KEY,
    username   VARCHAR(100) NOT NULL UNIQUE,
    email      VARCHAR(100) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(50)  NOT NULL DEFAULT 'user' CHECK (role in ('user', 'admin')),
    is_banned  BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mangas (
    id          SERIAL       PRIMARY KEY,
    title       VARCHAR(255) NOT NULL UNIQUE,
    description TEXT         NOT NULL,
    author      VARCHAR(100) NOT NULL,
    artist      VARCHAR(100) NOT NULL,
    tags        TEXT[],
    cover_url   TEXT         NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favs (
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    manga_id   INTEGER NOT NULL REFERENCES mangas(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, manga_id)
);

CREATE TABLE IF NOT EXISTS histories (
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    manga_id        INTEGER NOT NULL REFERENCES mangas(id) ON DELETE CASCADE,
    last_chapter_id INTEGER NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, manga_id)
);

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trigger_mangas_updated_at
    BEFORE UPDATE ON mangas
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trigger_histories_updated_at
    BEFORE UPDATE ON histories
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
