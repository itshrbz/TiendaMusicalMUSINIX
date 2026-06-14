# Backend PHP de Musinix

API REST sencilla para conectar React con PHP sin interferir con Firebase Authentication ni con la base de datos Firebase.

## URL local con XAMPP

`http://localhost/TiendaMusicalMUSINIX/backend/api.php`

## Endpoints

- `GET ?resource=health`
- `GET ?resource=products`
- `GET ?resource=products&id=1`
- `GET ?resource=events`
- `POST ?resource=contact`
- `POST ?resource=shipping`
- `GET ?resource=geocode&q=Cochabamba`
- `GET ?resource=reverse&lat=-17.3935&lon=-66.1570`

Los mensajes y envíos se guardan temporalmente en archivos JSON para demostrar el backend. Después se pueden migrar a Firebase sin cambiar las pantallas principales.
