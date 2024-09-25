import express from 'express';
import { addProductToCart, getCartById, deleteCartById, getUserCart } from '../controllers/cartController.js';  
import CartManager from '../dao/db/cart-manager-db.js'; 
import ProductManager from '../dao/db/product-manager-db.js'; 
import CartModel from '../dao/models/cart.model.js';
import { authenticateJWT } from '../middleware/auth.js';


const cartRouter = express.Router();
const router = express.Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

// Definir las rutas para cartRouter
cartRouter.post('/api/carts/:cid/products/:pid', addProductToCart);
cartRouter.get('/api/carts/:cid', getCartById);
cartRouter.delete('/api/carts/:cid', deleteCartById);

// Definir las rutas para el router
router.get('/cart', async (req, res) => {
    console.log('Usuario autenticado:', req.user);
    try {
        const cart = await cartManager.getCart(req.user.cartId); 
        console.log('Contenido del carrito:', cart);
        const products = cart.products || []; 
        const totalPrice = products.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

        res.render('cartDetails', {
            products,
            totalPrice,
        });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito');
    }
});

// Ruta para obtener los detalles del carrito por su ID
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await CartModel.findById(cid).populate('products.product');

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        if (req.headers['content-type'] === 'application/json') {
            return res.json(cart);
        }

        res.render('cartDetails', { cart, cartId: cart._id });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// Ruta para la versión web, renderiza una vista con Handlebars
router.get('/cart/:cid', getCartById);

router.get('/api/carts', authenticateJWT, getUserCart); //carrito del usuario autenticado

// Exportar ambos enrutadores por separado
export { cartRouter, router };
