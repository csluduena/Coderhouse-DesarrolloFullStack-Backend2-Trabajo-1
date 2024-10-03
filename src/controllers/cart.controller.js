import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

export const getCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            cart = new Cart({ user: req.user.userId, items: [] });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error al añadir al carrito:', error);
        res.status(500).json({ message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    const { itemId } = req.params;
    try {
        const cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();
        res.json({ message: 'Item eliminado del carrito', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCartItem = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item no encontrado en el carrito' });
        }
        item.quantity = quantity;
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        cart.items = [];
        await cart.save();
        res.json({ message: 'Carrito vaciado con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};