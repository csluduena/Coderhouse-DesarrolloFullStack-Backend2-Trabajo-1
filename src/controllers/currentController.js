import passport from 'passport';
import CartModel from '../dao/models/cart.model.js';

export const getCurrentUser = async (req, res) => {
    try {
        const user = await passport.authenticate('current', { session: false });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getCurrentUserCart = async (req, res) => {
    try {
        const user = req.user; // Obtener el usuario logueado
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const cart = await CartModel.findOne({ userId: user._id }).populate('products.product'); // Obtener el carrito del usuario
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error getting current user cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};