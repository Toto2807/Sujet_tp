-- ⚙️ promouvoir l'utilisateur de test en admin
UPDATE users SET role = 'admin'
WHERE email = 'user1@example.com';

-- 👤 ajouter un moderateur factice (mot de passe non utilisable pour login)
INSERT INTO users (username, email, password, role, is_ban)
SELECT 'moderateur1', 'moderateur1@example.com', 'N/A', 'moderateur', FALSE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'moderateur1@example.com');

-- 📚 mangas (8 entrées)
INSERT INTO manga (title, description, author, artist, tags, cover_url, published_at)
SELECT 'One Piece', 'Pirates et grande aventure', 'Eiichiro Oda', 'Eiichiro Oda', ARRAY['aventure','pirate'], 'https://example.com/op.jpg', '1997-07-22'
WHERE NOT EXISTS (SELECT 1 FROM manga WHERE title='One Piece');

INSERT INTO manga (title, description, author, artist, tags, cover_url, published_at)
SELECT 'Naruto', 'Ninja, amitié et rivalités', 'Masashi Kishimoto', 'Masashi Kishimoto', ARRAY['action','ninja'], 'https://example.com/naruto.jpg', '1999-09-21'
WHERE NOT EXISTS (SELECT 1 FROM manga WHERE title='Naruto');

INSERT INTO manga (title, description, author, artist, tags, cover_url, published_at)
SELECT 'Bleach', 'Shinigami et hollows', 'Tite Kubo', 'Tite Kubo', ARRAY['action','fantastique'], 'https://example.com/bleach.jpg', '2001-08-07'
WHERE NOT EXISTS (SELECT 1 FROM manga WHERE title='Bleach');

INSERT INTO manga (title, description, author, artist, tags, cover_url, published_at)
SELECT 'Attack on Titan', 'Humanité vs Titans', 'Hajime Isayama', 'Hajime Isayama', ARRAY['dark','action'], 'https://example.com/aot.jpg', '2009-09-09'
WHERE NOT EXISTS (SELECT 1 FROM manga WHERE title='Attack on Titan');

INSERT INTO manga (title, description, author, artist, tags, cover_url, published_at)
SELECT 'Jujutsu Kaisen', 'Fléaux et exorcistes', 'Gege Akutami', 'Gege Akutami', ARRAY['action','surnaturel'], 'https://example.com/jjk.jpg', '2018-03-05'
WHERE NOT EXISTS (SELECT 1 FROM manga WHERE title='Jujutsu Kaisen');

INSERT INTO manga (title, description, author, artist, tags, cover_url, published_at)
SELECT 'Chainsaw Man', 'Démons et tronçonneuse', 'Tatsuki Fujimoto', 'Tatsuki Fujimoto', ARRAY['horreur','action'], 'https://example.com/csm.jpg', '2018-12-03'
WHERE NOT EXISTS (SELECT 1 FROM manga WHERE title='Chainsaw Man');

INSERT INTO manga (title, description, author, artist, tags, cover_url, published_at)
SELECT 'Fullmetal Alchemist', 'Deux frères alchimistes', 'Hiromu Arakawa', 'Hiromu Arakawa', ARRAY['aventure','fantasy'], 'https://example.com/fma.jpg', '2001-07-12'
WHERE NOT EXISTS (SELECT 1 FROM manga WHERE title='Fullmetal Alchemist');

INSERT INTO manga (title, description, author, artist, tags, cover_url, published_at)
SELECT 'Vagabond', 'Vie de Miyamoto Musashi', 'Takehiko Inoue', 'Takehiko Inoue', ARRAY['samurai','seinen'], 'https://example.com/vagabond.jpg', '1998-09-17'
WHERE NOT EXISTS (SELECT 1 FROM manga WHERE title='Vagabond');

-- ❤️ fav pour l'admin sur "One Piece"
INSERT INTO fav (id_user, id_manga)
SELECT u.id, m.id
FROM users u, manga m
WHERE u.email = 'user1@example.com' AND m.title = 'One Piece'
ON CONFLICT (id_user, id_manga) DO NOTHING;

-- 📖 history pour l'admin sur "One Piece"
-- last_chapter_id = ObjectId simulé (24 hex)
INSERT INTO history (user_id, manga_id, last_chapter_id, updated_at)
SELECT u.id, m.id, '652fa1c0b9a4f3d2e1c0ab12', now()
FROM users u, manga m
WHERE u.email = 'user1@example.com' AND m.title = 'One Piece'
ON CONFLICT (user_id, manga_id)
DO UPDATE SET last_chapter_id = EXCLUDED.last_chapter_id, updated_at = now();
