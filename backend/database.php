<?php

declare(strict_types=1);

function databaseConnection(): ?PDO
{
    static $connection = false;

    if ($connection instanceof PDO) {
        return $connection;
    }

    if ($connection === null) {
        return null;
    }

    try {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            DB_HOST,
            DB_PORT,
            DB_NAME
        );

        $connection = new PDO($dsn, DB_USER, DB_PASSWORD, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        return $connection;
    } catch (Throwable) {
        $connection = null;
        return null;
    }
}

function databaseEnabled(): bool
{
    return databaseConnection() instanceof PDO;
}
