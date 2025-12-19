INSERT INTO users (username, email, password, role)
VALUES
('admin', 'admin@example.com', 'hashed_admin_password', 'admin'),
('john_doe', 'john@example.com', 'hashed_password_1', 'user'),
('jane_smith', 'jane@example.com', 'hashed_password_2', 'user');

INSERT INTO mangas (title, description, author, artist, tags, cover_url)
VALUES
(
    'One Piece',
    'A young pirate sets sail to find the legendary One Piece.',
    'Eiichiro Oda',
    'Eiichiro Oda',
    ARRAY['adventure', 'pirates', 'shounen'],
    'https://example.com/covers/one_piece.jpg'
),
(
    'Naruto',
    'A ninja seeks recognition and dreams of becoming Hokage.',
    'Masashi Kishimoto',
    'Masashi Kishimoto',
    ARRAY['ninja', 'action', 'shounen'],
    'https://example.com/covers/naruto.jpg'
),
(
    'Attack on Titan',
    'Humanity fights for survival against giant humanoid creatures.',
    'Hajime Isayama',
    'Hajime Isayama',
    ARRAY['dark', 'action', 'drama'],
    'https://example.com/covers/aot.jpg'
);

INSERT INTO favs (id_user, id_manga)
VALUES
(2, 1), -- john_doe favorites One Piece
(2, 2), -- john_doe favorites Naruto
(3, 3); -- jane_smith favorites Attack on Titan

INSERT INTO histories (user_id, manga_id, last_chapter_id)
VALUES
(2, 1, 1050), -- john_doe last read chapter 1050 of One Piece
(2, 2, 700),  -- john_doe last read chapter 700 of Naruto
(3, 3, 90);   -- jane_smith last read chapter 90 of AOT
