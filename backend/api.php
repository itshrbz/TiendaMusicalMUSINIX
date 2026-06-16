<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/repositories.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$resource = cleanText($_GET['resource'] ?? 'health', 50);

if ($resource === 'health' && $method === 'GET') {
    jsonResponse([
        'ok' => true,
        'message' => 'Backend PHP de Musinix funcionando.',
        'database' => databaseEnabled() ? 'mysql' : 'json-fallback',
        'time' => date(DATE_ATOM),
    ]);
}

if ($resource === 'dashboard' && $method === 'GET') {
    $sales = readJsonFile('sales.json');
    $totalSales = array_reduce(
        $sales,
        static fn(float $total, array $sale): float => $total + (float) ($sale['total'] ?? 0),
        0.0
    );

    jsonResponse([
        'ok' => true,
        'data' => [
            'total_sales' => $totalSales,
            'users' => count(listUsers()),
            'products' => count(readJsonFile('products.json')),
            'songs' => count(listSongs()),
            'events' => count(readJsonFile('events.json')),
            'database' => databaseEnabled() ? 'MySQL' : 'JSON local de respaldo',
            'recent_activity' => [
                ['date' => date('Y-m-d'), 'activity' => 'Panel administrativo convertido a React JSX', 'user' => 'Admin Musinix'],
                ['date' => date('Y-m-d'), 'activity' => 'API de canciones disponible', 'user' => 'Backend PHP'],
            ],
        ],
    ]);
}

if ($resource === 'products') {
    if ($method === 'GET') {
        $products = readJsonFile('products.json');
        $id = queryId();
        $search = lowerText(cleanText($_GET['search'] ?? '', 80));
        $format = lowerText(cleanText($_GET['format'] ?? '', 40));

        if ($id !== null) {
            $product = findJsonRecord('products.json', $id);
            if ($product === null) {
                jsonResponse(['ok' => false, 'message' => 'Producto no encontrado.'], 404);
            }
            jsonResponse(['ok' => true, 'data' => $product]);
        }

        $filtered = array_values(array_filter($products, static function (array $product) use ($search, $format): bool {
            $matchesSearch = $search === ''
                || str_contains(lowerText(($product['name'] ?? '') . ' ' . ($product['artist'] ?? '')), $search);
            $matchesFormat = $format === ''
                || $format === 'all'
                || lowerText((string) ($product['format'] ?? '')) === $format;
            return $matchesSearch && $matchesFormat;
        }));

        jsonResponse(['ok' => true, 'data' => $filtered]);
    }

    if ($method === 'POST' || $method === 'PUT') {
        $body = requestBody();
        $name = cleanText($body['name'] ?? '', 150);
        $artist = cleanText($body['artist'] ?? '', 150);
        $format = cleanText($body['format'] ?? 'Digital', 40);
        $category = cleanText($body['category'] ?? '', 80);
        $description = cleanText($body['description'] ?? '', 1000);
        $image = cleanText($body['image'] ?? '', 500);
        $price = filter_var($body['price'] ?? null, FILTER_VALIDATE_FLOAT);
        $stock = filter_var($body['stock'] ?? null, FILTER_VALIDATE_INT);

        if ($name === '' || $artist === '' || $price === false || $stock === false) {
            jsonResponse(['ok' => false, 'message' => 'Completa nombre, artista, precio y stock.'], 422);
        }

        $record = compact('name', 'artist', 'category', 'format', 'price', 'stock', 'description', 'image');

        if ($method === 'POST') {
            jsonResponse(['ok' => true, 'message' => 'Producto creado.', 'data' => createJsonRecord('products.json', $record)], 201);
        }

        $id = queryId();
        if ($id === null) {
            jsonResponse(['ok' => false, 'message' => 'Falta el ID del producto.'], 422);
        }
        $updated = updateJsonRecord('products.json', $id, $record);
        if ($updated === null) {
            jsonResponse(['ok' => false, 'message' => 'Producto no encontrado.'], 404);
        }
        jsonResponse(['ok' => true, 'message' => 'Producto actualizado.', 'data' => $updated]);
    }

    if ($method === 'DELETE') {
        $id = queryId();
        if ($id === null || !deleteJsonRecord('products.json', $id)) {
            jsonResponse(['ok' => false, 'message' => 'Producto no encontrado.'], 404);
        }
        jsonResponse(['ok' => true, 'message' => 'Producto eliminado.']);
    }
}

if ($resource === 'events') {
    if ($method === 'GET') {
        $id = queryId();
        if ($id !== null) {
            $event = findJsonRecord('events.json', $id);
            if ($event === null) {
                jsonResponse(['ok' => false, 'message' => 'Evento no encontrado.'], 404);
            }
            jsonResponse(['ok' => true, 'data' => $event]);
        }
        jsonResponse(['ok' => true, 'data' => readJsonFile('events.json')]);
    }

    if ($method === 'POST' || $method === 'PUT') {
        $body = requestBody();
        $name = cleanText($body['name'] ?? '', 150);
        $description = cleanText($body['description'] ?? '', 1000);
        $type = cleanText($body['type'] ?? 'Promoción', 80);
        $discount = filter_var($body['discount'] ?? 0, FILTER_VALIDATE_FLOAT);
        $startDate = cleanText($body['start_date'] ?? $body['date'] ?? '', 20);
        $endDate = cleanText($body['end_date'] ?? $startDate, 20);

        if ($name === '' || $startDate === '' || $discount === false) {
            jsonResponse(['ok' => false, 'message' => 'Completa nombre, fecha y descuento.'], 422);
        }

        $record = [
            'name' => $name,
            'description' => $description,
            'type' => $type,
            'discount' => $discount,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'date' => $startDate,
        ];

        if ($method === 'POST') {
            jsonResponse(['ok' => true, 'message' => 'Evento creado.', 'data' => createJsonRecord('events.json', $record)], 201);
        }

        $id = queryId();
        $updated = $id === null ? null : updateJsonRecord('events.json', $id, $record);
        if ($updated === null) {
            jsonResponse(['ok' => false, 'message' => 'Evento no encontrado.'], 404);
        }
        jsonResponse(['ok' => true, 'message' => 'Evento actualizado.', 'data' => $updated]);
    }

    if ($method === 'DELETE') {
        $id = queryId();
        if ($id === null || !deleteJsonRecord('events.json', $id)) {
            jsonResponse(['ok' => false, 'message' => 'Evento no encontrado.'], 404);
        }
        jsonResponse(['ok' => true, 'message' => 'Evento eliminado.']);
    }
}

if ($resource === 'bundles') {
    if ($method === 'GET') {
        $id = queryId();
        if ($id !== null) {
            $bundle = findJsonRecord('bundles.json', $id);
            if ($bundle === null) {
                jsonResponse(['ok' => false, 'message' => 'Bundle no encontrado.'], 404);
            }
            jsonResponse(['ok' => true, 'data' => $bundle]);
        }
        jsonResponse(['ok' => true, 'data' => readJsonFile('bundles.json')]);
    }

    if ($method === 'POST' || $method === 'PUT') {
        $body = requestBody();
        $name = cleanText($body['name'] ?? '', 150);
        $products = cleanText($body['products'] ?? '', 300);
        $category = cleanText($body['category'] ?? '', 80);
        $description = cleanText($body['description'] ?? '', 1000);
        $price = filter_var($body['price'] ?? null, FILTER_VALIDATE_FLOAT);
        $stock = filter_var($body['stock'] ?? null, FILTER_VALIDATE_INT);

        if ($name === '' || $products === '' || $price === false || $stock === false) {
            jsonResponse(['ok' => false, 'message' => 'Completa nombre, productos, precio y stock.'], 422);
        }

        $record = compact('name', 'products', 'category', 'price', 'stock', 'description');

        if ($method === 'POST') {
            jsonResponse(['ok' => true, 'message' => 'Bundle creado.', 'data' => createJsonRecord('bundles.json', $record)], 201);
        }

        $id = queryId();
        $updated = $id === null ? null : updateJsonRecord('bundles.json', $id, $record);
        if ($updated === null) {
            jsonResponse(['ok' => false, 'message' => 'Bundle no encontrado.'], 404);
        }
        jsonResponse(['ok' => true, 'message' => 'Bundle actualizado.', 'data' => $updated]);
    }

    if ($method === 'DELETE') {
        $id = queryId();
        if ($id === null || !deleteJsonRecord('bundles.json', $id)) {
            jsonResponse(['ok' => false, 'message' => 'Bundle no encontrado.'], 404);
        }
        jsonResponse(['ok' => true, 'message' => 'Bundle eliminado.']);
    }
}

if ($resource === 'sales' && $method === 'GET') {
    jsonResponse(['ok' => true, 'data' => readJsonFile('sales.json')]);
}

if ($resource === 'users') {
    if ($method === 'GET') {
        $id = queryId();
        $search = cleanText($_GET['search'] ?? '', 100);
        $users = listUsers($id, $search);
        if ($id !== null) {
            if ($users === []) {
                jsonResponse(['ok' => false, 'message' => 'Usuario no encontrado.'], 404);
            }
            jsonResponse(['ok' => true, 'data' => $users[0], 'storage' => databaseEnabled() ? 'mysql' : 'json-fallback']);
        }
        jsonResponse(['ok' => true, 'data' => $users, 'storage' => databaseEnabled() ? 'mysql' : 'json-fallback']);
    }

    if ($method === 'POST' || $method === 'PUT') {
        $body = requestBody();
        $name = cleanText($body['name'] ?? '', 120);
        $email = lowerText(cleanText($body['email'] ?? '', 150));
        $password = (string) ($body['password'] ?? '');
        $role = in_array($body['role'] ?? 'user', ['admin', 'user'], true) ? $body['role'] : 'user';
        $status = in_array($body['status'] ?? 'active', ['active', 'inactive'], true) ? $body['status'] : 'active';

        if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse(['ok' => false, 'message' => 'Ingresa un nombre y un correo válido.'], 422);
        }
        if ($method === 'POST' && strlen($password) < 8) {
            jsonResponse(['ok' => false, 'message' => 'La contraseña debe tener al menos 8 caracteres.'], 422);
        }
        if ($method === 'PUT' && $password !== '' && strlen($password) < 8) {
            jsonResponse(['ok' => false, 'message' => 'La nueva contraseña debe tener al menos 8 caracteres.'], 422);
        }

        $data = compact('name', 'email', 'password', 'role', 'status');

        try {
            if ($method === 'POST') {
                jsonResponse(['ok' => true, 'message' => 'Usuario creado.', 'data' => createUser($data)], 201);
            }

            $id = queryId();
            $updated = $id === null ? null : updateUser($id, $data);
            if ($updated === null) {
                jsonResponse(['ok' => false, 'message' => 'Usuario no encontrado.'], 404);
            }
            jsonResponse(['ok' => true, 'message' => 'Usuario actualizado.', 'data' => $updated]);
        } catch (PDOException $exception) {
            $message = $exception->getCode() === '23000'
                ? 'Ese correo ya está registrado.'
                : 'No se pudo guardar el usuario en la base de datos.';
            jsonResponse(['ok' => false, 'message' => $message], 409);
        }
    }

    if ($method === 'DELETE') {
        $id = queryId();
        if ($id === null || !deleteUser($id)) {
            jsonResponse(['ok' => false, 'message' => 'Usuario no encontrado.'], 404);
        }
        jsonResponse(['ok' => true, 'message' => 'Usuario eliminado.']);
    }
}

if ($resource === 'songs') {
    if ($method === 'GET') {
        $id = queryId();
        $search = cleanText($_GET['search'] ?? '', 100);
        $genre = cleanText($_GET['genre'] ?? '', 80);
        $songs = listSongs($id, $search, $genre);

        if ($id !== null) {
            if ($songs === []) {
                jsonResponse(['ok' => false, 'message' => 'Canción no encontrada.'], 404);
            }
            jsonResponse(['ok' => true, 'data' => $songs[0], 'storage' => databaseEnabled() ? 'mysql' : 'json-fallback']);
        }

        jsonResponse(['ok' => true, 'data' => $songs, 'storage' => databaseEnabled() ? 'mysql' : 'json-fallback']);
    }

    if ($method === 'POST' || $method === 'PUT') {
        $body = requestBody();
        $title = cleanText($body['title'] ?? '', 150);
        $artist = cleanText($body['artist'] ?? '', 150);
        $album = cleanText($body['album'] ?? '', 150);
        $genre = cleanText($body['genre'] ?? '', 80);
        $duration = cleanText($body['duration'] ?? '', 10);
        $coverUrl = cleanText($body['cover_url'] ?? '', 500);
        $audioUrl = cleanText($body['audio_url'] ?? '', 500);
        $price = filter_var($body['price'] ?? 0, FILTER_VALIDATE_FLOAT);
        $active = filter_var($body['active'] ?? 1, FILTER_VALIDATE_INT);
        $active = $active === 0 ? 0 : 1;

        if ($title === '' || $artist === '' || $price === false) {
            jsonResponse(['ok' => false, 'message' => 'Completa título, artista y precio.'], 422);
        }

        $data = [
            'title' => $title,
            'artist' => $artist,
            'album' => $album,
            'genre' => $genre,
            'duration' => $duration,
            'price' => $price,
            'cover_url' => $coverUrl,
            'audio_url' => $audioUrl,
            'active' => $active,
        ];

        if ($method === 'POST') {
            jsonResponse(['ok' => true, 'message' => 'Canción creada.', 'data' => createSong($data)], 201);
        }

        $id = queryId();
        $updated = $id === null ? null : updateSong($id, $data);
        if ($updated === null) {
            jsonResponse(['ok' => false, 'message' => 'Canción no encontrada.'], 404);
        }
        jsonResponse(['ok' => true, 'message' => 'Canción actualizada.', 'data' => $updated]);
    }

    if ($method === 'DELETE') {
        $id = queryId();
        if ($id === null || !deleteSong($id)) {
            jsonResponse(['ok' => false, 'message' => 'Canción no encontrada.'], 404);
        }
        jsonResponse(['ok' => true, 'message' => 'Canción eliminada.']);
    }
}

if ($resource === 'contact' && $method === 'POST') {
    $body = requestBody();
    $name = cleanText($body['name'] ?? '', 100);
    $email = cleanText($body['email'] ?? '', 150);
    $phone = cleanText($body['phone'] ?? '', 30);
    $message = cleanText($body['message'] ?? '', 1000);

    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') {
        jsonResponse(['ok' => false, 'message' => 'Completa nombre, correo válido y mensaje.'], 422);
    }

    $record = appendJsonFile('contacts.json', compact('name', 'email', 'phone', 'message'));
    jsonResponse(['ok' => true, 'message' => 'Mensaje recibido correctamente.', 'data' => $record], 201);
}

if ($resource === 'shipping' && $method === 'POST') {
    $body = requestBody();
    $recipientName = cleanText($body['recipient_name'] ?? '', 120);
    $phone = cleanText($body['phone'] ?? '', 30);
    $shippingMethod = cleanText($body['shipping_method'] ?? 'standard', 30);
    $address = cleanText($body['address'] ?? '', 300);
    $references = cleanText($body['references'] ?? '', 500);
    $latitude = filter_var($body['latitude'] ?? null, FILTER_VALIDATE_FLOAT);
    $longitude = filter_var($body['longitude'] ?? null, FILTER_VALIDATE_FLOAT);

    if ($recipientName === '' || $phone === '' || $latitude === false || $longitude === false) {
        jsonResponse(['ok' => false, 'message' => 'Completa los datos del destinatario y selecciona una ubicación.'], 422);
    }

    if ($latitude < -90 || $latitude > 90 || $longitude < -180 || $longitude > 180) {
        jsonResponse(['ok' => false, 'message' => 'Las coordenadas no son válidas.'], 422);
    }

    $record = appendJsonFile('shipments.json', [
        'recipient_name' => $recipientName,
        'phone' => $phone,
        'shipping_method' => $shippingMethod,
        'address' => $address,
        'references' => $references,
        'latitude' => $latitude,
        'longitude' => $longitude,
    ]);

    jsonResponse(['ok' => true, 'message' => 'Datos de envío guardados.', 'data' => $record], 201);
}

if ($resource === 'geocode' && $method === 'GET') {
    $query = cleanText($_GET['q'] ?? '', 180);
    if (textLength($query) < 3) {
        jsonResponse(['ok' => false, 'message' => 'Escribe al menos 3 caracteres para buscar.'], 422);
    }

    $results = nominatimRequest('/search', [
        'q' => $query,
        'limit' => 5,
        'countrycodes' => 'bo',
        'addressdetails' => 1,
    ]);

    $data = array_map(static fn(array $item): array => [
        'display_name' => $item['display_name'] ?? '',
        'lat' => isset($item['lat']) ? (float) $item['lat'] : null,
        'lon' => isset($item['lon']) ? (float) $item['lon'] : null,
    ], $results);

    jsonResponse(['ok' => true, 'data' => $data]);
}

if ($resource === 'reverse' && $method === 'GET') {
    $latitude = filter_input(INPUT_GET, 'lat', FILTER_VALIDATE_FLOAT);
    $longitude = filter_input(INPUT_GET, 'lon', FILTER_VALIDATE_FLOAT);

    if ($latitude === false || $latitude === null || $longitude === false || $longitude === null) {
        jsonResponse(['ok' => false, 'message' => 'Coordenadas inválidas.'], 422);
    }

    $result = nominatimRequest('/reverse', [
        'lat' => $latitude,
        'lon' => $longitude,
        'zoom' => 18,
        'addressdetails' => 1,
    ]);

    jsonResponse([
        'ok' => true,
        'data' => [
            'display_name' => $result['display_name'] ?? 'Dirección no encontrada',
            'lat' => $latitude,
            'lon' => $longitude,
        ],
    ]);
}

jsonResponse(['ok' => false, 'message' => 'Recurso o método no permitido.'], 404);
