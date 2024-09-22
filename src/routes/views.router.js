import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from '../dao/db/cart-manager-db.js';
import { login } from '../controllers/authController.js';
import { getCurrentUser } from '../controllers/currentController.js';
import passport from '../config/passport.js';
import UserModel from '../dao/models/user.model.js';
import CartModel from '../dao/models/cart.model.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", (req, res) => {
    res.render("home");
});

router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', login);
router.get('/register', (req, res) => {
    res.render('register');
});
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.json(req.user);
});
router.use('/api/sessions', passport.authenticate('jwt', { session: false }));
router.get('/api/sessions/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.json(req.user);
});




router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ first_name, last_name, email, age, password: hashedPassword });
        await user.save();

        // Crear un carrito para el usuario
        const cart = new CartModel({ userId: user._id });
        await cart.save();

        // Asignar el carrito al usuario
        user.cart = cart._id;
        await user.save();

        const token = jwt.sign({ sub: user._id, user }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        console.error('Error creando carrito:', error);
        res.status(500).json({ error: 'Error creando carrito' });
    }
});

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

















router.get('/carts', async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts();
        res.render('carts.handlebars', { carts });
    } catch (error) {
        console.error('Error fetching carts for view:', error);
        res.status(500).render('error', { message: 'Internal server error' });
    }
});

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

        res.render("productsDetails", { product });
    } catch (error) {
        console.error("Error getting product:", error);
        res.status(500).json({
            status: "error",
            error: "Internal Server Error",
        });
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const { sort = 'asc', query = '' } = req.query;
        const validSort = ['asc', 'desc'].includes(sort) ? sort : 'asc';

        const products = await productManager.getProducts(query);

        const sortedProducts = products.sort((a, b) => {
            return validSort === 'asc' ? a.price - b.price : b.price - a.price;
        });

        res.render('realtimeproducts', { products: sortedProducts });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get("/products/add", (req, res) => {
    res.render("addProduct");
});

export default router;
