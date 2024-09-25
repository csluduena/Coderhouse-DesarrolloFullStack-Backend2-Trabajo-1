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

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Configuración de handlebars
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

// Middlewares globales
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public'));

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
app.use('/api/carts', cartRouter); // Maneja las rutas de carrito
app.use('/api/products', productsRouter); // Maneja las rutas de productos
app.use('/api/sessions', authRouter); // Maneja las rutas de autenticación (login/logout)
app.use('/', viewsRouter); // Rutas para vistas


// // Rutas API
// app.use('/api', cartRouter);
// app.use('/api/products', productsRouter);
// app.use('/api/sessions', viewsRouter);
// app.use('/api/cart', cartRouter);
// app.use('/api/auth', authRouter); 
// app.use('/api/sessions', authRouter);// Ruta raíz para vistas
// app.use('/', viewsRouter);
// app.use('/api/sessions', authRouter); 


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views');


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



app.post('/login', async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err); // Pasar el error al siguiente middleware
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.logIn(user, { session: false }, async (err) => {
            if (err) {
                return next(err);
            }
            // Generar el token JWT aquí
            const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token }); // Devolver el token al cliente
        });
    })(req, res, next);
});

// Configuración de Socket.io
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