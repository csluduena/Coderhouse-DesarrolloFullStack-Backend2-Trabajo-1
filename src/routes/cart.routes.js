import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { getCart, addToCart, removeFromCart, updateCartItem, clearCart } from '../controllers/cart.controller.js';
import Cart from '../models/cart.model.js';

const router = Router();

router.use(isAuthenticated);

// router.get('/', getCart);
router.get('/:cid', getCart);
router.post('/add', addToCart);
router.delete('/remove/:itemId', removeFromCart);
router.put('/update/:itemId', updateCartItem);
router.delete('/clear', clearCart);

//Ruta para obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const userCart = await Cart.findOne({ user: req.user.userId });
        if (!userCart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.json(userCart);
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        const productIndex = cart.items.findIndex(item => item.product.toString() === pid);
        if (productIndex > -1) {
            cart.items[productIndex].quantity += quantity;
        } else {
            cart.items.push({ product: pid, quantity });
        }
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findByIdAndDelete(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.status(200).json({ message: "Carrito eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        cart.items = cart.items.filter(item => item.product.toString() !== pid);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;