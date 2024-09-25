import CartManager from '../dao/db/cart-manager-db.js';  // Importar el cart manager
import CartModel from '../dao/models/cart.model.js';
import mongoose from 'mongoose';

// Controlador para agregar un producto al carrito
export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params; // Extrae los parámetros de la ruta
        const { quantity } = req.body;  // Cantidad enviada en el cuerpo de la petición (opcional)

        // Verificar si el carrito existe
        const cart = await CartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Verificar si el producto existe
        const product = await ProductModel.findById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Verificar si el producto ya está en el carrito
        const existingProduct = cart.products.find(p => p.productId.toString() === pid);
        if (existingProduct) {
            existingProduct.quantity += quantity || 1;
        } else {
            cart.products.push({ productId: mongoose.Types.ObjectId(pid), quantity: quantity || 1 });
        }

        await cart.save();

        res.status(200).json({ message: 'Producto agregado al carrito', cart });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
};

//Controlador para obtener un carrito por su ID
export const getCartById = async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await CartModel.findById(cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.status(200).render('cartDetails', { cart }); // Renderiza la vista con Handlebars
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// export const getCartById = async (req, res) => {
//     const { cid } = req.params;
//     try {
//         const cart = await CartModel.findById(cid); // Cambia a CartModel
//         if (!cart) {
//             return res.status(404).json({ error: 'Carrito no encontrado' });
//         }
//         res.status(200).json(cart);
//     } catch (error) {
//         res.status(500).json({ error: 'Error del servidor' });
//     }
// };

export const deleteCartById = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await CartModel.findByIdAndDelete(cid); // Cambia a CartModel
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.status(200).json({ message: 'Carrito eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el carrito' });
    }
};

export const getUserCart = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const userId = req.user._id;
        const cart = await CartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error obteniendo el carrito del usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Función para agregar un producto al carrito
// export const addProductToCart = async (req, res) => {
//     const userId = req.user._id; // Asegúrate de que el middleware esté configurado para agregar el usuario autenticado
//     const { productId } = req.body;

//     try {
//         const cart = await CartManager.addProductToCart(userId, productId);
//         res.json(cart);
//     } catch (error) {
//         res.status(500).json({ error: 'Error adding product to cart' });
//     }
// };

// Función para obtener el carrito
// export const getCart = async (req, res) => {
//     const userId = req.user._id; // Obtén el ID del usuario desde el token
//     try {
//         const userCart = await CartManager.getCart(userId);
//         res.render('carts', { cart: userCart.products }); // Renderiza la vista del carrito
//     } catch (error) {
//         console.error('Error fetching cart:', error);
//         res.status(500).json({ message: 'Error fetching cart' });
//     }
// };

// Función para eliminar un producto del carrito
export const removeProductFromCart = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;

    try {
        const cart = await CartManager.removeProductFromCart(userId, productId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error removing product from cart' });
    }
};

export const getCartView = async (req, res) => {
    try {
        // Obtener el ID del usuario logueado
        const userId = req.user.id;

        // Obtener el carrito del usuario
        const CartManager = new CartManager();
        const cart = await CartManager.getCart(userId);

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        // Renderizar la vista del carrito
        res.render('carts', { cart }); // Asegúrate de que la vista se llame 'carts.handlebars'
    } catch (error) {
        res.status(500).json({ message: "Error al mostrar el carrito" });
    }
};




export default CartManager;