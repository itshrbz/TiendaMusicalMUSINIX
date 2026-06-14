<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

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
        'time' => date(DATE_ATOM),
    ]);
}

if ($resource === 'products' && $method === 'GET') {
    $products = readJsonFile('products.json');
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    $search = lowerText(cleanText($_GET['search'] ?? '', 80));
    $format = lowerText(cleanText($_GET['format'] ?? '', 40));

    if ($id) {
        foreach ($products as $product) {
            if ((int) $product['id'] === $id) {
                jsonResponse(['ok' => true, 'data' => $product]);
            }
        }
        jsonResponse(['ok' => false, 'message' => 'Producto no encontrado.'], 404);
    }

    $filtered = array_values(array_filter($products, static function (array $product) use ($search, $format): bool {
        $matchesSearch = $search === ''
            || str_contains(lowerText($product['name'] . ' ' . $product['artist']), $search);
        $matchesFormat = $format === ''
            || $format === 'all'
            || lowerText($product['format']) === $format;
        return $matchesSearch && $matchesFormat;
    }));

    jsonResponse(['ok' => true, 'data' => $filtered]);
}

if ($resource === 'events' && $method === 'GET') {
    jsonResponse(['ok' => true, 'data' => readJsonFile('events.json')]);
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
