# Proyecto de Backend para la Academia Coderhouse

Este proyecto es la primera entrega del curso de Backend 2 en la academia Coderhouse, y es una continuación de las entregas anteriores del curso de Backend 1. Esta entrega incluye la implementación de funcionalidades clave relacionadas con la gestión de usuarios y carritos de compras.

## Características del Proyecto

### Backend

- **Gestión de Usuarios:**
  - **Modelo de Usuario:**
    - Campos:
      - `first_name`: String
      - `last_name`: String
      - `email`: String (único)
      - `age`: Number
      - `password`: String (hash)
      - `cart`: Id con referencia a `Carts`
      - `role`: String (default: ‘user’)
    - Se utilizó el paquete **bcrypt** para encriptar contraseñas mediante el método `hashSync`.
  
- **Gestión de Carritos:**
  - **Creación de Carritos:**
    - Se creó un carrito automáticamente para cada usuario registrado.
  
- **Autenticación y Autorización:**
  - **Estrategias de Passport:**
    - Implementadas para funcionar con el modelo de usuarios.
  - **Sistema de Login:**
    - Autenticación mediante JWT (JSON Web Tokens) para sesiones de usuario.

- **Estrategia “current”:**
  - Permite extraer el token de la cookie y obtener el usuario asociado.
  - Devuelve los datos del usuario si el token es válido, o un error en caso contrario.

- **Rutas API:**
  - Agregada la ruta `/api/sessions/current` para validar al usuario logueado y devolver sus datos asociados al JWT.

### Endpoints

- **Usuarios:**
  - `POST /api/users`: Crear un nuevo usuario.
  - `GET /api/users/:uid`: Obtener datos de un usuario por ID.
  - `DELETE /api/users/:uid`: Eliminar un usuario por ID.

- **Carritos:**
  - `POST /api/carts`: Crear un nuevo carrito.
  - `GET /api/carts/:cid`: Obtener un carrito por ID.
  - `PUT /api/carts/:cid`: Actualizar un carrito existente.
  - `DELETE /api/carts/:cid`: Eliminar un carrito por ID.

  ### Frontend

- **Interactividad en Tiempo Real:**
  - **Socket.io:** Actualiza la lista de productos en tiempo real en la interfaz de usuario sin necesidad de refrescar la página.
  - **Eventos de WebSocket:** Emisión de eventos dentro de las peticiones POST para la creación y eliminación de productos.

- **Vistas Actualizadas:**
  - **Página de Inicio:** `http://localhost:8080` - Contiene botones para acceder a las vistas de productos, productos en tiempo real, y agregar productos. Incluye una guía de usuario con ejemplos de cómo utilizar los parámetros de consulta.
  - **Página de Productos:** `http://localhost:8080/products` - Muestra una lista de productos con opción para comprar y paginación.
  - **Página de Productos en Tiempo Real:** `http://localhost:8080/realtimeproducts` - Actualización en tiempo real de los productos.
  - **Formulario de Agregar Productos:** `http://localhost:8080/products/add` - Permite añadir nuevos productos manualmente o importando un backup de stock.
  - **Vista de Detalles del Producto:** `http://localhost:8080/products/:pid` - Detalles completos del producto.
  - **Vista de Carritos:** `http://localhost:8080/carts/:cid` - Visualiza un carrito específico con los productos correspondientes.

- **Estilos Personalizados:**
  - **CSS:** Estilización mejorada para una experiencia de usuario más atractiva, incluyendo una nueva sombra blanca para los botones.

## Tecnologías Utilizadas

- **Node.js:** Plataforma de desarrollo backend.
- **Express:** Framework de Node.js para construir aplicaciones web y APIs.
- **MongoDB:** Base de datos NoSQL para almacenamiento de datos.
- **Mongoose:** ODM para MongoDB, facilita la interacción con la base de datos.
- **Bcrypt:** Biblioteca para encriptar contraseñas.
- **Passport.js:** Middleware para la autenticación.
- **JWT:** Método para gestionar sesiones de usuario.

## Ejecución del Proyecto

1. Clona el repositorio.
2. Instala las dependencias con `npm install`.
3. Configura las variables de entorno necesarias (por ejemplo, `JWT_SECRET`).
4. Ejecuta el servidor con `node app.js`.
5. Utiliza Postman para probar los diferentes endpoints.

## Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún problema o tienes alguna sugerencia, no dudes en abrir un issue en el repositorio.

## Autor

Sebastián Ludueña - [Linkedin](https://www.linkedin.com/in/csluduena/) - [GitHub](https://github.com/csluduena) - [Web](https://csluduena.com.ar)

```
ExampleEntregaBackend2
├─ .gitignore
├─ package-lock.json
├─ package.json
├─ readme.md
└─ src
   ├─ app.js
   ├─ config
   │  └─ passport.js
   ├─ controllers
   │  ├─ authController.js
   │  ├─ cartController.js
   │  ├─ currentController.js
   │  ├─ productsController.js
   │  └─ views.controller.js
   ├─ dao
   │  ├─ db
   │  │  ├─ cart-manager-db.js
   │  │  └─ product-manager-db.js
   │  ├─ fs
   │  │  └─ products.json
   │  └─ models
   │     ├─ cart.model.js
   │     ├─ product.model.js
   │     └─ user.model.js
   ├─ database.js
   ├─ middleware
   │  └─ auth.js
   ├─ public
   │  ├─ css
   │  │  ├─ indexHLB.css
   │  │  ├─ login.css
   │  │  ├─ register.css
   │  │  └─ style.css
   │  ├─ fonts
   │  │  └─ dienasty.otf
   │  ├─ img
   │  │  ├─ Alexi-Hexed-1.jpg
   │  │  ├─ carpiLoco.gif
   │  │  ├─ carrito.png
   │  │  ├─ carritoICO.png
   │  │  ├─ carritoICO2.png
   │  │  ├─ ESP-LTD-Alexi-Hexed.png
   │  │  ├─ esp-ltd-kh-v-rdsp-kirk-hammett-guitarra-electrica-red-sparkle.jpg
   │  │  ├─ esp-ltd-kh-v-rdsp-kirk-hammett-red-sparkle.png
   │  │  ├─ fender-american-BurstRW.png
   │  │  ├─ GibsonLesPaul50sTribute2016T.png
   │  │  ├─ GibsonLesPaulStudio2016T.png
   │  │  ├─ GibsonLesPaulTraditional2016T.png
   │  │  ├─ GibsonSGFaded2016T.png
   │  │  ├─ GibsonSGStandard2016T.png
   │  │  ├─ guitarBann.gif
   │  │  ├─ guitarBannW.gif
   │  │  ├─ guitarBannW2.gif
   │  │  ├─ PlayerStrat3-ColourSunburstPF.png
   │  │  ├─ wallG.jpg
   │  │  ├─ wallG2.png
   │  │  ├─ wallGBlurred.jpg
   │  │  └─ wallGBlurred.png
   │  └─ js
   │     └─ index.js
   ├─ routes
   │  ├─ auth.router.js
   │  ├─ cart.router.js
   │  ├─ products.router.js
   │  └─ views.router.js
   └─ views
      ├─ addProduct.handlebars
      ├─ cart.handlebars
      ├─ cartDetails.handlebars
      ├─ error.handlebars
      ├─ home.handlebars
      ├─ layouts
      │  └─ main.handlebars
      ├─ login.handlebars
      ├─ products.handlebars
      ├─ productsDetails.handlebars
      ├─ realtimeproducts.handlebars
      └─ register.handlebars

```