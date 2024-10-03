import { Router } from 'express';
import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
import ProductManager from '../dao/db/productManagerDb.js';
import CartManager from '../dao/db/cartManagerDb.js';
import { isAuthenticated, checkUserSession, isAdmin } from '../middlewares/auth.middleware.js';


const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();




router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartManager.getCartById(cid);

        if (!cart) {
            return res.status(404).json({
                status: "error",
                message: "Carrito no encontrado"
            });
        }

        const cartProducts = cart.products.map(item => {
            let thumbnailArray = [];
            item.product.thumbnails.forEach(img => {
                thumbnailArray.push(img);
            });

            return {
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                thumbnail: thumbnailArray
            };
        });

        res.render('cart', {
            cartId: cid,
            products: cartProducts,
            totalItems: cart.products.length,
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
});

router.get('/products/:id', isAuthenticated, async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.id);
        if (!product) {
            return res.status(404).render('error', { message: 'Producto no encontrado' });
        }
        res.render('productDetails', { product, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error al cargar el producto' });
    }
});

router.post('/logout', async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
});

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts(1, 8);
        res.render('home', { products: products.docs, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error al cargar la página de inicio' });
    }
});

router.get('/products', isAuthenticated, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const sort = req.query.sort || 'createdAt';
        const products = await productManager.getProducts(page, limit, sort);
        res.render('products', {
            products: products.docs,
            pagination: {
                page: products.page,
                totalPages: products.totalPages,
                hasNextPage: products.hasNextPage,
                hasPrevPage: products.hasPrevPage,
                nextPage: products.nextPage,
                prevPage: products.prevPage
            },
            user: req.user,
            sort: sort
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error al cargar los productos' });
    }
});

router.get('/cart', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('cart');
        if (!user || !user.cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }
        const cart = await Cart.findById(user.cart).populate('items.product');
        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }
        res.render('cart', {
            cart: cart,
            user: req.user,
            cartItems: cart.items.map(item => ({
                ...item.toObject(),
                product: item.product.toObject()
            }))
        });
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        res.status(500).render('error', { message: 'Error al cargar el carrito' });
    }
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.user });
});

export default router;