import 'dotenv/config'; // Carga y configura dotenv antes de otros imports
import express from 'express';
import exphbs from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';
import http from 'http';
import { Server } from 'socket.io';
import './database.js';
import ProductManager from './dao/db/product-manager-db.js';
// import bodyParser from 'body-parser'; // Importar body-parser usando ES Modules
import passport from './config/passport.js'; // Importar la configuración personalizada de passport
import cartsRouter from './routes/cart.router.js'; // Importa el cartsRouter
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Configuración de Handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

// Registrar el helper para calcular el precio total
hbs.handlebars.registerHelper('calculateTotalPrice', function (products) {
    let total = 0;
    products.forEach(product => {
        total += product.quantity * product.product.price;
    });
    return total;
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public'));
// app.use(bodyParser.json()); // Comentado porque express.json() ya lo maneja
// app.use(bodyParser.urlencoded({ extended: true })); // Comentado porque express.urlencoded() ya lo maneja
app.use(passport.initialize()); // Inicializa Passport para manejar autenticaciones
app.use(cookieParser()); // Middleware para manejar cookies

// Montar routers de API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', viewsRouter); // Rutas para la autenticación de sesiones

// Montar rutas de vistas
app.use('/', viewsRouter); // Rutas para las vistas

app.use('/favicon.ico', (req, res) => res.status(204).end()); // Manejo de favicon

// Modificar la ruta principal para no pasar información de usuario
app.get('/', (req, res) => {
    res.render('home'); // Renderiza la vista principal
});

// Manejo de WebSocket para actualizaciones en tiempo real
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

// Iniciar servidor
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Manejo de rutas no encontradas
app.get('*', (req, res) => {
    res.status(400).send('Route not found');
});
