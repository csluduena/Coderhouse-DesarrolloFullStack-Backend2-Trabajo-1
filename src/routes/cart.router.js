import express from 'express';
import CartManager from '../dao/db/cart-manager-db.js';
import ProductManager from '../dao/db/product-manager-db.js';
import CartModel from '../dao/models/cart.model.js';
import ProductModel from '../dao/models/product.model.js';

const router = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.post('/:pid', async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        const cart = await cartManager.addProductToCart(userId, productId);
        return res.json(cart);
    } catch (error) {
        console.error('Error agregando producto al carrito:', error);
        return res.status(500).json({ error: 'Error agregando producto al carrito' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.pid;
        const cart = await cartManager.removeProductFromCart(userId, productId);
        return res.json(cart);
    } catch (error) {
        console.error('Error eliminando producto del carrito:', error);
        return res.status(500).json({ error: 'Error eliminando producto del carrito' });
    }
});

router.delete('/:uid/clear', async (req, res) => {
    try {
        const userId = req.params.uid;
        const cart = await cartManager.clearCart(userId);
        res.json(cart);
    } catch (error) {
        console.error('Error eliminando productos del carrito:', error);
        res.status(500).json({ error: 'Error eliminando productos del carrito' });
    }
});

router.get('/:uid', async (req, res) => {
    try {
        const userId = req.params.uid;
        const cart = await CartModel.findOne({ id: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error obteniendo carrito:', error);
        res.status(500).json({ error: 'Error obteniendo carrito' });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;


        const cart = await CartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }


        const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }


        const productInCart = cart.products[productIndex];


        if (productInCart.quantity > 1) {

            productInCart.quantity -= 1;
        } else {

            cart.products.splice(productIndex, 1);
        }


        await cart.save();

        res.status(200).json({
            status: 'success',
            message: 'Producto actualizado/eliminado del carrito',
            cart
        });
    } catch (error) {
        console.error('Error eliminando producto del carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error eliminando producto del carrito' });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartData = req.body;

        // Buscar el carrito
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Actualizar la información del carrito
        Object.assign(cart, cartData);
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error('Error actualizando carrito:', error);
        res.status(500).json({ error: 'Error actualizando carrito' });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        // Buscar el carrito y el producto
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Agregar el producto al carrito
        const existingProductIndex = cart.products.findIndex((item) => item.product.toString() === productId);
        if (existingProductIndex >= 0) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error('Error agregando producto al carrito:', error);
        res.status(500).json({ error: 'Error agregando producto al carrito' });
    }
});


router.get('/', async (req, res) => {
    try {
        const carts = await CartModel.find();
        res.json(carts);
    } catch (error) {
        console.error('Error obteniendo carritos:', error);
        res.status(500).json({ error: 'Error obteniendo carritos' });
    }
});

export default router;