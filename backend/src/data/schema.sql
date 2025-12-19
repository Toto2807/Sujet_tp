CREATE TABLE IF NOT EXISTS users (
    id         SERIAL       PRIMARY KEY,
    username   VARCHAR(100) NOT NULL UNIQUE,
    email      VARCHAR(100) NOT NULL UNIQUE,
    password   VARCHAR(100) NOT NULL,
    role       VARCHAR(50)  NOT NULL DEFAULT 'user' CHECK (role in ('user', 'admin')),
    is_banned  BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mangas (
    id          SERIAL       PRIMARY KEY,
    title       VARCHAR(100) NOT NULL UNIQUE,
    description TEXT         NOT NULL,
    author      VARCHAR(100) NOT NULL,
    artist      VARCHAR(100) NOT NULL,
    tags        TEXT[],
    cover_url   VARCHAR(100) NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favs (
    id_user  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    id_manga INTEGER NOT NULL REFERENCES mangas(id) ON DELETE CASCADE,
    PRIMARY KEY (id_user, id_manga)
);

CREATE TABLE IF NOT EXISTS histories (
    user_id         SERIAL NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    manga_id        SERIAL NOT NULL REFERENCES mangas(id) ON DELETE CASCADE,
    last_chapter_id SERIAL NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, manga_id)
);
