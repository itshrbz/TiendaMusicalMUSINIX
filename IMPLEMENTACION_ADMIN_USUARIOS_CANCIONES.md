# Implementación adicional de Musinix

## 1. Panel administrativo convertido a JSX

Las antiguas páginas HTML del directorio `admin` fueron convertidas a componentes React.

Ruta principal:

```text
http://localhost:5173/admin
```

Rutas disponibles:

```text
/admin/dashboard
/admin/sales
/admin/users
/admin/products
/admin/songs
/admin/bundles
/admin/events
```

Los formularios para registrar y editar productos, canciones, bundles y eventos también están hechos en JSX.

Archivos principales:

```text
musinix-react/src/components/admin/AdminLayout.jsx
musinix-react/src/pages/admin/
musinix-react/src/App.jsx
```

## 2. Base de datos de usuarios

El script de MySQL está en:

```text
backend/database/musinix.sql
```

### Importación en XAMPP

1. Iniciar Apache y MySQL.
2. Entrar a `http://localhost/phpmyadmin`.
3. Presionar **Importar**.
4. Seleccionar `backend/database/musinix.sql`.
5. Ejecutar la importación.

La configuración predeterminada está en `backend/config.php`:

```php
DB_HOST = 127.0.0.1
DB_PORT = 3306
DB_NAME = musinix
DB_USER = root
DB_PASSWORD = vacío
```

Usuario inicial:

```text
Correo: admin@musinix.com
Contraseña de demostración: admin123
```

La contraseña se almacena mediante `password_hash`, no como texto plano.

Si MySQL todavía no está iniciado o la base no fue importada, la API utiliza temporalmente:

```text
backend/data/users.json
backend/data/songs.json
```

Esto permite probar el proyecto sin romper el backend anterior.

## 3. API de canciones

Endpoint principal:

```text
http://localhost/TiendaMusicalMUSINIX/backend/api.php?resource=songs
```

Métodos:

```text
GET    Lista canciones
GET    ?resource=songs&id=1
GET    ?resource=songs&search=Mili
GET    ?resource=songs&genre=Rock
POST   Registra una canción
PUT    ?resource=songs&id=1
DELETE ?resource=songs&id=1
```

Ejemplo de JSON para registrar una canción:

```json
{
  "title": "Nombre de la canción",
  "artist": "Nombre del artista",
  "album": "Nombre del álbum",
  "genre": "Rock",
  "duration": "3:45",
  "price": 1.99,
  "cover_url": "https://ejemplo.com/portada.jpg",
  "audio_url": "https://ejemplo.com/audio.mp3",
  "active": 1
}
```

## 4. Verificación de la implementación anterior

Se conservan:

- Backend PHP anterior.
- Productos y eventos cargados desde PHP.
- Formulario de contacto.
- Guardado de datos de envío.
- OpenStreetMap con Leaflet.
- Búsqueda de direcciones y geocodificación inversa.
- Flujo Carrito → Envío → Pago.

El mapa sigue en:

```text
musinix-react/src/pages/shipping.jsx
```

Los servicios siguen en:

```text
musinix-react/src/services/api.js
backend/api.php
backend/helpers.php
backend/config.php
```
