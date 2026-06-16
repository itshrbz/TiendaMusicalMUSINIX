<?php

declare(strict_types=1);

function listUsers(?int $id = null, string $search = ''): array
{
    $db = databaseConnection();

    if ($db instanceof PDO) {
        if ($id !== null) {
            $statement = $db->prepare('SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE id = ?');
            $statement->execute([$id]);
            $user = $statement->fetch();
            return $user ? [$user] : [];
        }

        if ($search !== '') {
            $statement = $db->prepare('SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE name LIKE ? OR email LIKE ? ORDER BY id DESC');
            $term = '%' . $search . '%';
            $statement->execute([$term, $term]);
            return $statement->fetchAll();
        }

        return $db->query('SELECT id, name, email, role, status, created_at, updated_at FROM users ORDER BY id DESC')->fetchAll();
    }

    $users = array_map('publicUser', readJsonFile('users.json'));

    if ($id !== null) {
        return array_values(array_filter($users, static fn(array $user): bool => (int) $user['id'] === $id));
    }

    if ($search !== '') {
        $needle = lowerText($search);
        $users = array_values(array_filter($users, static function (array $user) use ($needle): bool {
            return str_contains(lowerText(($user['name'] ?? '') . ' ' . ($user['email'] ?? '')), $needle);
        }));
    }

    usort($users, static fn(array $a, array $b): int => (int) $b['id'] <=> (int) $a['id']);
    return $users;
}

function createUser(array $data): array
{
    $db = databaseConnection();
    $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);

    if ($db instanceof PDO) {
        $statement = $db->prepare('INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)');
        $statement->execute([$data['name'], $data['email'], $passwordHash, $data['role'], $data['status']]);
        return listUsers((int) $db->lastInsertId())[0];
    }

    foreach (readJsonFile('users.json') as $user) {
        if (lowerText((string) $user['email']) === lowerText($data['email'])) {
            jsonResponse(['ok' => false, 'message' => 'Ese correo ya está registrado.'], 409);
        }
    }

    $record = createJsonRecord('users.json', [
        'name' => $data['name'],
        'email' => $data['email'],
        'password_hash' => $passwordHash,
        'role' => $data['role'],
        'status' => $data['status'],
    ]);

    return publicUser($record);
}

function updateUser(int $id, array $data): ?array
{
    $db = databaseConnection();

    if ($db instanceof PDO) {
        $fields = ['name = ?', 'email = ?', 'role = ?', 'status = ?'];
        $values = [$data['name'], $data['email'], $data['role'], $data['status']];

        if ($data['password'] !== '') {
            $fields[] = 'password_hash = ?';
            $values[] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        $values[] = $id;
        $statement = $db->prepare('UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?');
        $statement->execute($values);
        $users = listUsers($id);
        return $users[0] ?? null;
    }

    $changes = [
        'name' => $data['name'],
        'email' => $data['email'],
        'role' => $data['role'],
        'status' => $data['status'],
    ];

    if ($data['password'] !== '') {
        $changes['password_hash'] = password_hash($data['password'], PASSWORD_DEFAULT);
    }

    $record = updateJsonRecord('users.json', $id, $changes);
    return $record ? publicUser($record) : null;
}

function deleteUser(int $id): bool
{
    $db = databaseConnection();

    if ($db instanceof PDO) {
        $statement = $db->prepare('DELETE FROM users WHERE id = ?');
        $statement->execute([$id]);
        return $statement->rowCount() > 0;
    }

    return deleteJsonRecord('users.json', $id);
}

function listSongs(?int $id = null, string $search = '', string $genre = ''): array
{
    $db = databaseConnection();

    if ($db instanceof PDO) {
        $conditions = [];
        $values = [];

        if ($id !== null) {
            $conditions[] = 'id = ?';
            $values[] = $id;
        }
        if ($search !== '') {
            $conditions[] = '(title LIKE ? OR artist LIKE ? OR album LIKE ?)';
            $term = '%' . $search . '%';
            array_push($values, $term, $term, $term);
        }
        if ($genre !== '' && $genre !== 'all') {
            $conditions[] = 'genre = ?';
            $values[] = $genre;
        }

        $sql = 'SELECT id, title, artist, album, genre, duration, price, cover_url, audio_url, active, created_at, updated_at FROM songs';
        if ($conditions !== []) {
            $sql .= ' WHERE ' . implode(' AND ', $conditions);
        }
        $sql .= ' ORDER BY id DESC';

        $statement = $db->prepare($sql);
        $statement->execute($values);
        return $statement->fetchAll();
    }

    $songs = readJsonFile('songs.json');
    $needle = lowerText($search);

    $songs = array_values(array_filter($songs, static function (array $song) use ($id, $needle, $genre): bool {
        $matchesId = $id === null || (int) ($song['id'] ?? 0) === $id;
        $matchesSearch = $needle === '' || str_contains(
            lowerText(($song['title'] ?? '') . ' ' . ($song['artist'] ?? '') . ' ' . ($song['album'] ?? '')),
            $needle
        );
        $matchesGenre = $genre === '' || $genre === 'all' || lowerText((string) ($song['genre'] ?? '')) === lowerText($genre);
        return $matchesId && $matchesSearch && $matchesGenre;
    }));

    usort($songs, static fn(array $a, array $b): int => (int) $b['id'] <=> (int) $a['id']);
    return $songs;
}

function createSong(array $data): array
{
    $db = databaseConnection();

    if ($db instanceof PDO) {
        $statement = $db->prepare(
            'INSERT INTO songs (title, artist, album, genre, duration, price, cover_url, audio_url, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $statement->execute([
            $data['title'], $data['artist'], $data['album'], $data['genre'], $data['duration'],
            $data['price'], $data['cover_url'], $data['audio_url'], $data['active'],
        ]);
        return listSongs((int) $db->lastInsertId())[0];
    }

    return createJsonRecord('songs.json', $data);
}

function updateSong(int $id, array $data): ?array
{
    $db = databaseConnection();

    if ($db instanceof PDO) {
        $statement = $db->prepare(
            'UPDATE songs SET title = ?, artist = ?, album = ?, genre = ?, duration = ?, price = ?, cover_url = ?, audio_url = ?, active = ? WHERE id = ?'
        );
        $statement->execute([
            $data['title'], $data['artist'], $data['album'], $data['genre'], $data['duration'],
            $data['price'], $data['cover_url'], $data['audio_url'], $data['active'], $id,
        ]);
        $songs = listSongs($id);
        return $songs[0] ?? null;
    }

    return updateJsonRecord('songs.json', $id, $data);
}

function deleteSong(int $id): bool
{
    $db = databaseConnection();

    if ($db instanceof PDO) {
        $statement = $db->prepare('DELETE FROM songs WHERE id = ?');
        $statement->execute([$id]);
        return $statement->rowCount() > 0;
    }

    return deleteJsonRecord('songs.json', $id);
}
