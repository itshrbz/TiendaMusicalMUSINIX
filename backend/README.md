# Backend PHP de Musinix

API REST utilizada por el frontend React.

## Comprobación

```text
http://localhost/TiendaMusicalMUSINIX/backend/api.php?resource=health
```

## Recursos

```text
health
products
events
bundles
sales
users
songs
contact
shipping
geocode
reverse
dashboard
```

## Base de datos

Importar en phpMyAdmin:

```text
backend/database/musinix.sql
```

La base contiene las tablas:

```text
users
songs
```

Mientras MySQL no esté disponible, los recursos `users` y `songs` utilizan automáticamente los archivos JSON locales de respaldo.

## Métodos CRUD

Los recursos `products`, `events`, `bundles`, `users` y `songs` permiten:

```text
GET
POST
PUT
DELETE
```

Para actualizar o eliminar se envía el ID en la URL:

```text
?resource=songs&id=1
```
