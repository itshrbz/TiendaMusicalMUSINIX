# Tienda Musical MUSINIX

Proyecto web con:

- React JS.
- Backend PHP.
- OpenStreetMap y Leaflet.
- Panel administrativo convertido a JSX.
- CRUD de productos, bundles, eventos, usuarios y canciones.
- Base de datos MySQL para usuarios y canciones.
- Archivos JSON locales como respaldo para pruebas.

## Ejecutar

1. Copiar la carpeta en `htdocs`.
2. Iniciar Apache y MySQL en XAMPP.
3. Importar `backend/database/musinix.sql` desde phpMyAdmin.
4. Abrir Git Bash dentro de `musinix-react`.
5. Ejecutar:

```bash
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173/
```

Panel administrador:

```text
http://localhost:5173/admin
```

Backend:

```text
http://localhost/TiendaMusicalMUSINIX/backend/api.php?resource=health
```

Más detalles:

```text
IMPLEMENTACION_PHP_MAPAS.md
IMPLEMENTACION_ADMIN_USUARIOS_CANCIONES.md
```
