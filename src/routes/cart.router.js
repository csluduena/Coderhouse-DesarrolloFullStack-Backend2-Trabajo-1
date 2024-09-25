import express from 'express';
import { Router } from 'express';
import { getCartById, addProductToCart } from '../controllers/cartController.js';  // Importa el controlador
import CartManager from '../dao/db/cart-manager-db.js'; // Asegúrate de que este sea el camino correcto
import ProductManager from '../dao/db/product-manager-db.js'; // Si necesitas manejar productos también

const router = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();


// Ruta para obtener y mostrar los detalles del carrito
router.get('/cart', async (req, res) => {
    console.log('Usuario autenticado:', req.user); // Verifica que el usuario esté autenticado
    try {
        const cart = await cartManager.getCart(req.user.cartId); // Obtén el carrito del usuario
        console.log('Contenido del carrito:', cart); // Verifica el contenido del carrito
        const products = cart.products || []; // Asegúrate de que 'products' esté definido
        const totalPrice = products.reduce((acc, item) => acc + item.quantity * item.product.price, 0); // Calcula el total

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
        // Buscar el carrito y hacer populate de los productos
        const cart = await CartModel.findById(cid).populate('products.product');

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Si es una solicitud de la API (Postman), devolver en formato JSON
        if (req.headers['content-type'] === 'application/json') {
            return res.json(cart);
        }

        // Si no es una solicitud de API, renderizar la vista de carrito
        res.render('cartDetails', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});



// Ruta para la versión web, renderiza una vista con Handlebars
router.get('/cart/:cid', getCartById);

// Ruta para agregar un producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        // Asegúrate de pasar la cantidad si está en el cuerpo de la solicitud
        const quantity = req.body.quantity || 1; // Si no se proporciona, toma 1 por defecto
        const cart = await cartManager.addProductToCart(cid, pid, quantity); // Pasa la cantidad

        // Enviar respuesta
        res.status(200).json({ message: 'Producto agregado al carrito', cart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});





export default router;
