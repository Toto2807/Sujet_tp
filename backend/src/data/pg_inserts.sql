-- 1. Clear existing data to start fresh (Optional)
TRUNCATE users, mangas, favs, histories RESTART IDENTITY CASCADE;

-- 2. Insert Mangas
INSERT INTO mangas (title, description, author, artist, tags, cover_url) VALUES
('Void Sentinel', 'Sci-fi epic', 'Satoshi Kon', 'Yusuke Murata', ARRAY['Sci-Fi'], 'https://example.com/1.jpg');

-- 3. Insert Favs using Subqueries (Safest Way)
-- This finds the correct ID even if it's not "1"
INSERT INTO favs (user_id, manga_id) 
VALUES (
    (SELECT id FROM users WHERE username = 'otaku_king'),
    (SELECT id FROM mangas WHERE title = 'Void Sentinel')
);
