import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import { generateUniqueCode, calculateTotalAmount } from '../utils/util.js';
import { sendOrderConfirmationEmail } from '../services/email.service.js';

export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío' });
        }

        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));

        const total = calculateTotalAmount(cart.items);
        const code = generateUniqueCode();

        const newOrder = new Order({
            user: userId,
            code,
            items: orderItems,
            total
        });

        await newOrder.save();

        // Vaciar el carrito después de crear la orden
        cart.items = [];
        await cart.save();

        // Enviar correo de confirmación
        await sendOrderConfirmationEmail(req.user, newOrder);

        res.status(201).json({ message: 'Orden creada con éxito', order: newOrder });
    } catch (error) {
        console.error('Error al crear la orden:', error);
        res.status(500).json({ message: 'Error al crear la orden' });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        res.status(500).json({ message: 'Error al obtener las órdenes' });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error al obtener la orden:', error);
        res.status(500).json({ message: 'Error al obtener la orden' });
    }
};