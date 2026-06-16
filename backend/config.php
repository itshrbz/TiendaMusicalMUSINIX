<?php

declare(strict_types=1);

const APP_NAME = 'Musinix';
const DATA_DIR = __DIR__ . '/data';
const CACHE_DIR = __DIR__ . '/cache/nominatim';
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const NOMINATIM_USER_AGENT = 'Musinix-Univalle-Student-Project/1.0';

// Configuración MySQL de XAMPP. La API usa los JSON locales como respaldo
// mientras la base de datos todavía no haya sido importada en phpMyAdmin.
const DB_HOST = '127.0.0.1';
const DB_PORT = '3306';
const DB_NAME = 'musinix';
const DB_USER = 'root';
const DB_PASSWORD = '';

date_default_timezone_set('America/La_Paz');
