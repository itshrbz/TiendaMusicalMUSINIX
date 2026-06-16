CREATE DATABASE IF NOT EXISTS musinix
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE musinix;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS songs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    artist VARCHAR(150) NOT NULL,
    album VARCHAR(150) NULL,
    genre VARCHAR(80) NULL,
    duration VARCHAR(10) NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    cover_url VARCHAR(500) NULL,
    audio_url VARCHAR(500) NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO users (name, email, password_hash, role, status)
SELECT 'Admin Musinix', 'admin@musinix.com', '$2y$12$DkzS6UV2pZxPm/77WcrzduGyYEnXK3J4oszjoYNfqnVQHOIuBLOJ.', 'admin', 'active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@musinix.com');

INSERT INTO users (name, email, password_hash, role, status)
SELECT 'Jairo Marquez', 'jairo@email.com', '$2y$12$DkzS6UV2pZxPm/77WcrzduGyYEnXK3J4oszjoYNfqnVQHOIuBLOJ.', 'user', 'active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'jairo@email.com');

INSERT INTO songs (title, artist, album, genre, duration, price, cover_url, audio_url, active)
SELECT 'String Theocracy', 'Mili', 'To Kill a Living Book', 'Alternative', '3:03', 1.99,
       'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=900', '', 1
WHERE NOT EXISTS (SELECT 1 FROM songs WHERE title = 'String Theocracy' AND artist = 'Mili');

INSERT INTO songs (title, artist, album, genre, duration, price, cover_url, audio_url, active)
SELECT 'Feel Good Inc.', 'Gorillaz', 'Demon Days', 'Alternative', '3:42', 1.99,
       'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=900', '', 1
WHERE NOT EXISTS (SELECT 1 FROM songs WHERE title = 'Feel Good Inc.' AND artist = 'Gorillaz');
