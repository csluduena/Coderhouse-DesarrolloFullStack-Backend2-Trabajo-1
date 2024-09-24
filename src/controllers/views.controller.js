// import express from 'express';
// const router = express.Router();
// import CartModel from '../dao/models/cart.model.js';

// class ViewsController {
//     renderHome(req, res) {
//         res.render('home'); // Renderizar la vista principal
//     }

//     renderProducts(req, res) {
//         res.render('products'); // Renderizar la vista de productos
//     }

//     renderProduct(req, res) {
//         const productId = req.params.pid;
//         // Aquí puedes agregar lógica para obtener el producto por ID y pasarlo a la vista
//         res.render('productsDetails', { productId }); // Renderizar la vista del producto específico
//     }

//     renderCart = async (req, res) => {
//         try {
//             const userId = req.user._id; // Obtener el ID del usuario logueado
//             const cart = await CartModel.findOne({ userId }).populate('products.product'); // Buscar el carrito del usuario

//             if (!cart) {
//                 return res.status(404).render('error', { message: 'Carrito no encontrado' });
//             }

//             res.render('cartDetails', { cart: cart.products }); // Pasar los productos del carrito a la vista
//         } catch (error) {
//             console.error('Error obteniendo el carrito:', error);
//             res.status(500).render('error', { message: 'Error al obtener el carrito' });
//         }
//     }

//     renderLogin(req, res) {
//         res.render('login'); // Renderizar la vista de login
//     }

//     renderRegister(req, res) {
//         res.render('register'); // Renderizar la vista de registro
//     }

//     renderProfile(req, res) {
//         // Aquí puedes agregar lógica para obtener los datos del perfil del usuario
//         res.render('profile'); // Renderizar la vista de perfil
//     }

//     renderPurchases(req, res) {
//         // Aquí puedes agregar lógica para obtener las compras realizadas por el usuario
//         res.render('purchases'); // Renderizar la vista de compras
//     }
// }

// export default ViewsController;


import express from 'express';
const router = express.Router();

class ViewsController {
    renderHome(req, res) {
        res.render('home');
    }

    renderProducts(req, res) {
        res.render('products');
    }

    renderProduct(req, res) {
        const productId = req.params.pid;
        res.render('productsDetails', { productId });
    }

    renderLogin(req, res) {
        res.render('login');
    }

    renderRegister(req, res) {
        res.render('register');
    }

    renderProfile(req, res) {
        res.render('profile');
    }

    renderPurchases(req, res) {
        res.render('purchases');
    }
}

export default ViewsController;