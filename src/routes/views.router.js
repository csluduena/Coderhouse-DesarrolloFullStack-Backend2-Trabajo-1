import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from '../dao/db/cart-manager-db.js';
import { login } from '../controllers/authController.js';
import UserModel from '../dao/models/user.model.js';
import CartModel from '../dao/models/cart.model.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import passport from '../config/passport.js';
import { register } from '../controllers/authController.js';

const router = express.Router(); // Crear una instancia del router
const productManager = new ProductManager(); // Inicializar el ProductManager
const cartManager = new CartManager(); // Inicializar el CartManager

// Rutas de vistas
router.get("/", (req, res) => {
    res.render("home"); // Renderiza la vista de inicio
});

// Rutas de autenticación
router.get('/login', (req, res) => {
    res.render('login'); // Renderiza la vista de login
});
router.post('/login', login); // Ruta para manejar el login

router.post('/api/sessions/register', register); // Ruta para el registro de usuario

router.get('/register', (req, res) => {
    res.render('register'); // Renderiza la vista de registro
});

// Ruta para obtener información del usuario actual
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.json(req.user); // Devuelve los datos del usuario autenticado
});

// Rutas protegidas con JWT
router.use('/api/sessions', passport.authenticate('jwt', { session: false }));
router.get('/api/sessions/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.json(req.user); // Devuelve los datos del usuario autenticado
});

// Ruta para eliminar un usuario por ID
router.delete('/:uid', async (req, res) => {
    try {
        const userId = req.params.uid;
        await UserModel.findByIdAndDelete(userId);
        res.json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({ error: 'Error eliminando usuario' });
    }
});

// Ruta para obtener la vista de todos los carritos
router.get('/carts', async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts();
        res.render('carts', { carts }); // Renderiza la vista de carritos
    } catch (error) {
        console.error('Error fetching carts for view:', error);
        res.status(500).send('Error fetching carts');
    }
});

// Ruta para obtener productos con paginación y ordenamiento
router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 5, sort = 'asc', query = '' } = req.query;
        const validSort = ['asc', 'desc'].includes(sort) ? sort : 'asc';

        const productos = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit),
            query,
            sort: validSort,
        });

        const nuevoArray = productos.docs.map((producto) => {
            const rest = producto.toObject();
            return rest;
        });

        res.render("products", {
            productos: nuevoArray,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages,
        });
    } catch (error) {
        console.error("Error getting products:", error);
        res.status(500).json({
            status: "error",
            error: "Internal Server Error",
        });
    }
});

// Ruta para obtener detalles de un producto específico
router.get("/products/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);

        if (!product) {
            res.status(404).json({
                status: "error",
                error: "Product not found",
            });
            return;
        }

        res.render("productsDetails", { product }); // Renderiza la vista de detalles del producto
    } catch (error) {
        console.error("Error getting product:", error);
        res.status(500).json({
            status: "error",
            error: "Internal Server Error",
        });
    }
});

// Ruta para obtener productos en tiempo real
router.get("/realtimeproducts", async (req, res) => {
    try {
        const { sort = 'asc', query = '' } = req.query;
        const validSort = ['asc', 'desc'].includes(sort) ? sort : 'asc';

        const products = await productManager.getProducts(query);

        const sortedProducts = products.sort((a, b) => {
            return validSort === 'asc' ? a.price - b.price : b.price - a.price;
        });

        res.render('realtimeproducts', { products: sortedProducts }); // Renderiza la vista de productos en tiempo real
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Ruta para agregar un nuevo producto
router.get("/products/add", (req, res) => {
    res.render("addProduct"); // Renderiza la vista para agregar un producto
});

export default router; // Exporta el router
