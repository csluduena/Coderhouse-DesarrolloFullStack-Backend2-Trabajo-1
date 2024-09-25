import 'dotenv/config';
import express from 'express';
import exphbs from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';
import http from 'http';
import { Server } from 'socket.io';
import './database.js';
import ProductManager from './dao/db/product-manager-db.js';
import passport from './config/passport.js';
import cartRouter from './routes/cart.router.js';
import authRouter from './routes/auth.router.js';
import session from 'express-session'; // Importa express-session
import path from 'path';
import { fileURLToPath } from 'url'; // Esto es necesario para obtener __dirname en ESModules

// Configuración para obtener __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear instancia de la app de Express
const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Configuración de Handlebars
const hbs = exphbs.create({
    helpers: {
        multiply: (a, b) => a * b
    },
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

app.engine('handlebars', hbs.engine); // Configurar el motor de Handlebars
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); // Ruta corregida

// Middlewares globales
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // También arreglamos esta ruta

// Configuración del middleware de sesión
app.use(session({
    secret: 'tu_clave_secreta', // Cambia esto a una clave secreta segura
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Cambia a true si usas HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 día de duración de la cookie
    }
}));

// Rutas API
app.use('/api/cart', cartRouter); // Maneja las rutas de carrito (API)
app.use('/api/products', productsRouter); // Maneja las rutas de productos (API)
app.use('/api/sessions', authRouter); // Maneja las rutas de autenticación (API)

// Rutas web
app.use('/', viewsRouter); // Rutas para vistas en la web (handlebars)
app.use('/cart', viewsRouter, cartRouter); // Rutas para vistas del carrito


// Favicon
app.use('/favicon.ico', (req, res) => res.status(204).end());

// Ruta principal
app.get('/', (req, res) => {
    res.render('home');
});

// Manejo de rutas no encontradas (404)
app.get('*', (req, res) => {
    res.status(404).send('Route not found');
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Configuración de Socket.io para productos
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sortProducts', async (data) => {
        const { sort } = data;
        try {
            const products = await ProductManager.getProducts();
            const sortedProducts = products.sort((a, b) => {
                if (sort === 'asc') {
                    return a.price - b.price;
                } else if (sort === 'desc') {
                    return b.price - a.price;
                } else {
                    return 0;
                }
            });
            socket.emit('updateProducts', sortedProducts);
        } catch (error) {
            console.error('Error sorting products:', error);
            socket.emit('updateProducts', { error: 'Error al obtener productos' });
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Inicio del servidor
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

export default app;
