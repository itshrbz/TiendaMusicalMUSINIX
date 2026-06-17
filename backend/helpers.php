<?php

declare(strict_types=1);

function jsonResponse(array $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function requestBody(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        jsonResponse(['ok' => false, 'message' => 'El cuerpo JSON no es válido.'], 400);
    }

    return $data;
}

function cleanText(mixed $value, int $maxLength = 255): string
{
    $text = trim((string) $value);
    $text = strip_tags($text);
    return function_exists('mb_substr')
        ? mb_substr($text, 0, $maxLength)
        : substr($text, 0, $maxLength);
}

function lowerText(string $value): string
{
    return function_exists('mb_strtolower') ? mb_strtolower($value) : strtolower($value);
}

function textLength(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}

function readJsonFile(string $filename): array
{
    $path = DATA_DIR . '/' . $filename;
    if (!is_file($path)) {
        return [];
    }

    $content = file_get_contents($path);
    if ($content === false || trim($content) === '') {
        return [];
    }

    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

function appendJsonFile(string $filename, array $record): array
{
    $path = DATA_DIR . '/' . $filename;
    $handle = fopen($path, 'c+');

    if ($handle === false) {
        jsonResponse(['ok' => false, 'message' => 'No se pudo abrir el archivo de datos.'], 500);
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            jsonResponse(['ok' => false, 'message' => 'No se pudo bloquear el archivo de datos.'], 500);
        }

        rewind($handle);
        $content = stream_get_contents($handle);
        $records = $content ? json_decode($content, true) : [];
        if (!is_array($records)) {
            $records = [];
        }

        $record['id'] = count($records) > 0
            ? max(array_column($records, 'id')) + 1
            : 1;
        $record['created_at'] = date(DATE_ATOM);
        $records[] = $record;

        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, json_encode($records, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        fflush($handle);
        flock($handle, LOCK_UN);

        return $record;
    } finally {
        fclose($handle);
    }
}


function writeJsonFile(string $filename, array $records): void
{
    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0775, true);
    }

    $path = DATA_DIR . '/' . $filename;
    $encoded = json_encode(
        array_values($records),
        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

    if ($encoded === false || file_put_contents($path, $encoded, LOCK_EX) === false) {
        jsonResponse(['ok' => false, 'message' => 'No se pudo guardar el archivo de datos.'], 500);
    }
}

function createJsonRecord(string $filename, array $record): array
{
    $records = readJsonFile($filename);
    $ids = array_map(static fn(array $item): int => (int) ($item['id'] ?? 0), $records);
    $record['id'] = $ids === [] ? 1 : max($ids) + 1;
    $record['created_at'] = date(DATE_ATOM);
    $records[] = $record;
    writeJsonFile($filename, $records);
    return $record;
}

function updateJsonRecord(string $filename, int $id, array $changes): ?array
{
    $records = readJsonFile($filename);
    $updated = null;

    foreach ($records as $index => $record) {
        if ((int) ($record['id'] ?? 0) !== $id) {
            continue;
        }

        $records[$index] = array_merge($record, $changes, [
            'id' => $id,
            'updated_at' => date(DATE_ATOM),
        ]);
        $updated = $records[$index];
        break;
    }

    if ($updated !== null) {
        writeJsonFile($filename, $records);
    }

    return $updated;
}

function deleteJsonRecord(string $filename, int $id): bool
{
    $records = readJsonFile($filename);
    $filtered = array_values(array_filter(
        $records,
        static fn(array $record): bool => (int) ($record['id'] ?? 0) !== $id
    ));

    if (count($filtered) === count($records)) {
        return false;
    }

    writeJsonFile($filename, $filtered);
    return true;
}

function findJsonRecord(string $filename, int $id): ?array
{
    foreach (readJsonFile($filename) as $record) {
        if ((int) ($record['id'] ?? 0) === $id) {
            return $record;
        }
    }

    return null;
}

function queryId(): ?int
{
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    return ($id !== false && $id !== null && $id > 0) ? $id : null;
}

function publicUser(array $user): array
{
    unset($user['password_hash']);
    return $user;
}

function nominatimRequest(string $path, array $params): array
{
    if (!is_dir(CACHE_DIR)) {
        mkdir(CACHE_DIR, 0775, true);
    }

    $params['format'] = 'jsonv2';
    $url = NOMINATIM_BASE_URL . $path . '?' . http_build_query($params);
    $cachePath = CACHE_DIR . '/' . sha1($url) . '.json';

    if (is_file($cachePath) && filemtime($cachePath) > time() - 86400) {
        $cached = json_decode((string) file_get_contents($cachePath), true);
        if (is_array($cached)) {
            return $cached;
        }
    }

    $headers = [
        'Accept: application/json',
        'User-Agent: ' . NOMINATIM_USER_AGENT,
        'Referer: http://localhost/Musinix'
    ];

    // El servicio público de Nominatim permite como máximo una solicitud por segundo.
    $rateFile = CACHE_DIR . '/last_request.txt';
    $rateHandle = fopen($rateFile, 'c+');
    if ($rateHandle !== false) {
        flock($rateHandle, LOCK_EX);
        rewind($rateHandle);
        $lastRequest = (float) trim((string) stream_get_contents($rateHandle));
        $elapsed = microtime(true) - $lastRequest;
        if ($elapsed < 1) {
            usleep((int) ((1 - $elapsed) * 1000000));
        }
        rewind($rateHandle);
        ftruncate($rateHandle, 0);
        fwrite($rateHandle, (string) microtime(true));
        fflush($rateHandle);
        flock($rateHandle, LOCK_UN);
        fclose($rateHandle);
    }

    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 12,
            CURLOPT_HTTPHEADER => $headers,
        ]);
        $response = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);
    } else {
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'timeout' => 12,
                'header' => implode("\r\n", $headers),
            ],
        ]);
        $response = @file_get_contents($url, false, $context);
        $status = $response === false ? 500 : 200;
    }

    if ($response === false || $status >= 400) {
        jsonResponse(['ok' => false, 'message' => 'No se pudo consultar el servicio de mapas.'], 502);
    }

    $data = json_decode($response, true);
    if (!is_array($data)) {
        jsonResponse(['ok' => false, 'message' => 'La respuesta del servicio de mapas no es válida.'], 502);
    }

    file_put_contents($cachePath, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    return $data;
}
