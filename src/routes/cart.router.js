import express from 'express';
import { addProductToCart } from '../controllers/cartController.js';  // Importa el controlador
import CartManager from '../dao/db/cart-manager-db.js'; // Asegúrate de que este sea el camino correcto
import ProductManager from '../dao/db/product-manager-db.js'; // Si necesitas manejar productos también

const router = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

// Middleware para asegurarte de que el usuario esté autenticado
//router.use(authMiddleware); // Asegúrate de que el usuario esté logueado


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

// Ruta para agregar un producto al carrito
router.post('/cart/:cid/products/:pid', async (req, res) => {
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



// // Ruta para agregar un producto al carrito
// router.post('/cart/:cid/products/:pid', async (req, res) => {
//     console.log('Request body:', req.body); // Añadir este log para ver el cuerpo de la solicitud
//     const { cid, pid } = req.params;

//     try {
//         // Asegúrate de pasar la cantidad si está en el cuerpo de la solicitud
//         const quantity = req.body.quantity || 1; // Si no se proporciona, toma 1 por defecto
//         const cart = await cartManager.addProductToCart(cid, pid, quantity); // Pasa la cantidad

//         // Enviar respuesta
//         res.status(200).json({ message: 'Producto agregado al carrito', cart });
//     } catch (error) {
//         console.error('Error al agregar producto al carrito:', error);
//         res.status(500).json({ error: 'Error al agregar producto al carrito' });
//     }
// });




// Puedes eliminar esta línea, ya que ya no necesitas la antigua ruta
// router.post('/:cid/products/:pid', addProductToCart);


























// import express from 'express';
// // import CartManager from '../dao/db/cart-manager-db.js';
// // import ProductManager from '../dao/db/product-manager-db.js';
// import CartModel from '../dao/models/cart.model.js';
// import ProductModel from '../dao/models/product.model.js';
// import passport from 'passport';
// import { getCartView } from '../controllers/cartController.js';
// const router = express.Router(); // Crear una instancia del router
// // const cartManager = new CartManager(); // Inicializar el CartManager
// // const productManager = new ProductManager(); // Inicializar el ProductManager
// import { addProductToCart, /*getCart,*/ removeProductFromCart } from '../controllers/cartController.js';



// router.get('/carts', getCartView);  // Ruta para mostrar el carrito

// // // Ruta para obtener el carrito del usuario autenticado
// // router.get('/', passport.authenticate('jwt', { session: false }), getCart);

// // Ruta para agregar un producto al carrito
// router.post('/add', passport.authenticate('jwt', { session: false }), addProductToCart);

// // Ruta para eliminar un producto del carrito
// router.delete('/remove/:productId', passport.authenticate('jwt', { session: false }), removeProductFromCart);

// // Ruta para ver el carrito del usuario autenticado
// router.get('/carts', passport.authenticate('jwt', { session: false }), async (req, res) => {
//     const userId = req.user._id; // Obtén el ID del usuario desde el token
//     try {
//         const userCart = await cartManager.getCart(userId); // Obtén el carrito usando el ID del usuario
//         res.render('carts', { cart: userCart.products }); // Renderiza la vista del carrito
//     } catch (error) {
//         console.error('Error fetching cart:', error);
//         res.status(500).send('Error fetching cart'); // Manejo de error
//     }
// });

// // // Ruta para ver todos los carritos
// // router.get('/carts', async (req, res) => {
// //     try {
// //         const carts = await cartManager.getAllCarts(); // Método para obtener todos los carritos
// //         res.render('carts', { carts }); // Renderiza la vista de carritos
// //     } catch (error) {
// //         console.error('Error fetching carts:', error);
// //         res.status(500).send('Error fetching carts'); // Manejo de error
// //     }
// // });





// // // Ruta para agregar un producto al carrito
// // router.post('/:pid', async (req, res) => {
// //     try {
// //         const userId = req.user._id; // Obtener el ID del usuario
// //         const productId = req.params.pid; // Obtener el ID del producto
// //         const product = await productManager.getProductById(productId); // Buscar el producto

// //         // Si no se encuentra el producto, devolver un error 404
// //         if (!product) {
// //             return res.status(404).json({ error: 'Producto no encontrado' }); // 404 Not Found
// //         }

// //         const cart = await cartManager.addProductToCart(userId, productId); // Agregar el producto al carrito
// //         return res.json(cart); // Devolver el carrito actualizado
// //     } catch (error) {
// //         console.error('Error agregando producto al carrito:', error);
// //         return res.status(500).json({ error: 'Error agregando producto al carrito' }); // 500 Internal Server Error
// //     }
// // });

// // Ruta para eliminar un producto del carrito
// router.delete('/:pid', async (req, res) => {
//     try {
//         const userId = req.user._id; // Obtener el ID del usuario
//         const productId = req.params.pid; // Obtener el ID del producto
//         const cart = await cartManager.removeProductFromCart(userId, productId); // Eliminar el producto del carrito
//         return res.json(cart); // Devolver el carrito actualizado
//     } catch (error) {
//         console.error('Error eliminando producto del carrito:', error);
//         return res.status(500).json({ error: 'Error eliminando producto del carrito' }); // 500 Internal Server Error
//     }
// });

// // // Ruta para limpiar el carrito del usuario
// // router.delete('/:uid/clear', async (req, res) => {
// //     try {
// //         const userId = req.params.uid; // Obtener el ID del usuario
// //         const cart = await cartManager.clearCart(userId); // Limpiar el carrito
// //         res.json(cart); // Devolver el carrito limpio
// //     } catch (error) {
// //         console.error('Error eliminando productos del carrito:', error);
// //         res.status(500).json({ error: 'Error eliminando productos del carrito' }); // 500 Internal Server Error
// //     }
// // });

// // Ruta para obtener el carrito de un usuario
// router.get('/:uid', async (req, res) => {
//     try {
//         const userId = req.params.uid; // Obtener el ID del usuario
//         const cart = await CartModel.findOne({ id: userId }); // Buscar el carrito por ID
//         // Si no se encuentra el carrito, devolver un error 404
//         if (!cart) {
//             return res.status(404).json({ error: 'Carrito no encontrado' }); // 404 Not Found
//         }
//         res.json(cart); // Devolver el carrito encontrado
//     } catch (error) {
//         console.error('Error obteniendo carrito:', error);
//         res.status(500).json({ error: 'Error obteniendo carrito' }); // 500 Internal Server Error
//     }
// });

// // // Ruta para obtener el carrito de un usuario logueado
// // router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
// //     try {
// //         const userId = req.user._id; // Obtener el ID del usuario logueado
// //         const cart = await CartModel.findOne({ userId }).populate('products.product'); // Buscar el carrito del usuario
// //         if (!cart) {
// //             return res.status(404).json({ error: 'Carrito no encontrado' });
// //         }
// //         res.json(cart); // Devolver el carrito encontrado
// //     } catch (error) {
// //         console.error('Error obteniendo carrito del usuario:', error);
// //         res.status(500).json({ error: 'Error obteniendo carrito' });
// //     }
// // });

// // // Ruta para eliminar un producto específico de un carrito
// // router.delete('/:cid/product/:pid', async (req, res) => {
// //     try {
// //         const cartId = req.params.cid; // Obtener el ID del carrito
// //         const productId = req.params.pid; // Obtener el ID del producto

// //         const cart = await CartModel.findById(cartId); // Buscar el carrito por ID
// //         // Si no se encuentra el carrito, devolver un error 404
// //         if (!cart) {
// //             return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' }); // 404 Not Found
// //         }

// //         // Encontrar el índice del producto en el carrito
// //         const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);

// //         // Si no se encuentra el producto, devolver un error 404
// //         if (productIndex === -1) {
// //             return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' }); // 404 Not Found
// //         }

// //         const productInCart = cart.products[productIndex]; // Obtener el producto del carrito

// //         // Actualizar la cantidad del producto o eliminarlo si es necesario
// //         if (productInCart.quantity > 1) {
// //             productInCart.quantity -= 1; // Reducir la cantidad
// //         } else {
// //             cart.products.splice(productIndex, 1); // Eliminar el producto
// //         }

// //         await cart.save(); // Guardar los cambios en el carrito

// //         res.status(200).json({
// //             status: 'success',
// //             message: 'Producto actualizado/eliminado del carrito', // 200 OK
// //             cart // Devolver el carrito actualizado
// //         });
// //     } catch (error) {
// //         console.error('Error eliminando producto del carrito:', error);
// //         res.status(500).json({ status: 'error', message: 'Error eliminando producto del carrito' }); // 500 Internal Server Error
// //     }
// // });

// // Ruta para actualizar el carrito
// router.put('/:cid', async (req, res) => {
//     try {
//         const cartId = req.params.cid; // Obtener el ID del carrito
//         const cartData = req.body; // Obtener los datos del carrito
//         const cart = await CartModel.findById(cartId); // Buscar el carrito por ID
//         // Si no se encuentra el carrito, devolver un error 404
//         if (!cart) {
//             return res.status(404).json({ error: 'Carrito no encontrado' }); // 404 Not Found
//         }
//         // Actualizar la información del carrito
//         Object.assign(cart, cartData);
//         await cart.save(); // Guardar los cambios
//         res.json(cart); // Devolver el carrito actualizado
//     } catch (error) {
//         console.error('Error actualizando carrito:', error);
//         res.status(500).json({ error: 'Error actualizando carrito' }); // 500 Internal Server Error
//     }
// });

// // // Ruta para agregar un producto a un carrito específico
// router.post('/:cid/products/:pid', async (req, res) => {
//     try {
//         const cartId = req.params.cid; // Obtener el ID del carrito
//         const productId = req.params.pid; // Obtener el ID del producto
//         const cart = await CartModel.findById(cartId); // Buscar el carrito por ID
//         // Si no se encuentra el carrito, devolver un error 404
//         if (!cart) {
//             return res.status(404).json({ error: 'Carrito no encontrado' }); // 404 Not Found
//         }
//         const product = await ProductModel.findById(productId); // Buscar el producto por ID
//         // Si no se encuentra el producto, devolver un error 404
//         if (!product) {
//             return res.status(404).json({ error: 'Producto no encontrado' }); // 404 Not Found
//         }
//         // Agregar el producto al carrito
//         const existingProductIndex = cart.products.findIndex((item) => item.product.toString() === productId);
//         if (existingProductIndex >= 0) {
//             cart.products[existingProductIndex].quantity += 1; // Incrementar la cantidad
//         } else {
//             cart.products.push({ product: productId, quantity: 1 }); // Agregar nuevo producto
//         }
//         await cart.save(); // Guardar los cambios en el carrito
//         res.json(cart); // Devolver el carrito actualizado
//     } catch (error) {
//         console.error('Error agregando producto al carrito:', error);
//         res.status(500).json({ error: 'Error agregando producto al carrito' }); // 500 Internal Server Error
//     }
// });

// // // Ruta para obtener todos los carritos
// // router.get('/', async (req, res) => {
// //     try {
// //         const carts = await CartModel.find(); // Obtener todos los carritos
// //         res.json(carts); // Devolver la lista de carritos
// //     } catch (error) {
// //         console.error('Error obteniendo carritos:', error);
// //         res.status(500).json({ error: 'Error obteniendo carritos' }); // 500 Internal Server Error
// //     }
// // });



// export default router; // Exportar el router
