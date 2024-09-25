// import ProductManager from '../dao/db/product-manager-db.js';
// import axios from 'axios'; // Axios para hacer solicitudes HTTP

// export const getProducts = async (req, res) => {
//     try {
//         const products = await ProductManager.getProducts();

//         // Obtener la lista de carritos desde el endpoint GET /api/carts
//         const cartsResponse = await axios.get('http://localhost:8080/api/carts/carts');
//         const carts = cartsResponse.data;

//         res.render('products', { productos: products, carts: carts });
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         res.status(500).send('Error fetching products');
//     }
// };


// import ProductManager from '../dao/db/product-manager-db.js';
// import CartManager from '../dao/db/cart-manager-db.js';

// export const getProducts = async (req, res) => {
//     try {
//         const products = await ProductManager.getProducts();
//         const carts = await CartManager.getAllCarts(); // Asegúrate de obtener todos los carritos
//         res.render('products', { productos: products, carts: carts });
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         res.status(500).send('Error fetching products');
//     }
// };

import ProductManager from '../dao/db/product-manager-db.js';
import CartManager from '../dao/db/cart-manager-db.js'; // Importa el CartManager para manejar el carrito del usuario

export const getProducts = async (req, res) => {
    try {
        const products = await ProductManager.getProducts();

        // Obtener el carrito del usuario autenticado
        const userCart = await CartManager.getUserCart(req.user._id); // Aquí asegúrate de que req.user existe
        const cartId = userCart ? userCart._id : null; // Asegúrate de pasar el cartId

        // Renderiza la vista de productos con el cartId y los productos
        res.render('products', { products, cartId });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
};