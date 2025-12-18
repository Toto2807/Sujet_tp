CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    is_ban BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS manga (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    author TEXT,
    artist TEXT,
    tags TEXT[],
    cover_url TEXT,
    published_at DATE
);

CREATE TABLE IF NOT EXISTS fav (
    id_user UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    id_manga UUID NOT NULL REFERENCES manga(id) ON DELETE CASCADE,
    PRIMARY KEY (id_user, id_manga)
);

CREATE TABLE IF NOT EXISTS history (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    manga_id UUID NOT NULL REFERENCES manga(id) ON DELETE CASCADE,
    last_chapter_id TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, manga_id)
);
