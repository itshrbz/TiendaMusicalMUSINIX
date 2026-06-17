# Implementación realizada: Backend PHP y OpenStreetMap

## 1. Backend PHP

Se agregó la carpeta `backend` con una API REST en `backend/api.php`.

Funciones implementadas:

- Comprobar que el servidor PHP funciona.
- Listar y filtrar productos.
- Obtener el detalle de un producto.
- Listar eventos y promociones.
- Recibir y guardar formularios de contacto.
- Recibir y guardar datos de envío con latitud y longitud.
- Buscar direcciones y obtener direcciones desde coordenadas.

Para la demostración, los datos se guardan en archivos JSON. Esto permite presentar el backend PHP sin interferir con Firebase Authentication ni con la base de datos Firebase asignada a otro integrante.

## 2. OpenStreetMap

La pantalla `src/pages/shipping.jsx` utiliza Leaflet y OpenStreetMap.

Funciones implementadas:

- Visualización del mapa centrado en Cochabamba.
- Selección de ubicación haciendo clic.
- Marcador arrastrable.
- Búsqueda manual de direcciones en Bolivia.
- Conversión de coordenadas a dirección.
- Visualización de latitud y longitud.
- Guardado de la ubicación mediante PHP.

## 3. Pantallas conectadas al backend

- `products.jsx`
- `product-detail.jsx`
- `events.jsx`
- `contact.jsx`
- `shipping.jsx`

También se corrigió la navegación del carrito hacia la pantalla de envío.

## 4. Ejecución local

1. Copiar `TiendaMusicalMUSINIX` dentro de `C:\xampp\htdocs\`.
2. Iniciar Apache desde XAMPP.
3. Abrir una terminal dentro de `musinix-react`.
4. Ejecutar:

```bash
npm install
npm run dev
```

5. Abrir la dirección mostrada por Vite, normalmente `http://localhost:5173`.
6. Probar el backend en:

```text
http://localhost/TiendaMusicalMUSINIX/backend/api.php?resource=health
```

Debe aparecer un JSON indicando que el backend funciona.

## 5. Firebase Hosting

Firebase Hosting publicará el frontend compilado de React. El código PHP no se ejecuta directamente como un archivo normal dentro de Firebase Hosting; para la exposición local se usa XAMPP. En un despliegue completo, la API PHP debe estar en un servidor compatible con PHP o en un contenedor conectado a Firebase Hosting.
