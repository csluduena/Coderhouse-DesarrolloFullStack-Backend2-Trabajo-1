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
            // Si el producto ya está en el carrito, actualiza la cantidad
            existingProduct.quantity += quantity || 1;
        } else {
            // Si no está en el carrito, lo agrega con la cantidad
            cart.products.push({ productId: mongoose.Types.ObjectId(pid), quantity: quantity || 1 });
        }

        // Guardar el carrito actualizado
        await cart.save();

        res.status(200).json({ message: 'Producto agregado al carrito', cart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
};

//Controlador para obtener un carrito por su ID
export const getCartById = async (req, res) => {
    const { cid } = req.params; // Obtenemos el ID del carrito desde los parámetros de la ruta

    try {
        const cart = await CartModel.findById(cid).populate('products.product'); // Busca el carrito por ID y hace populate de productos

        if (!cart) {
            // Si no se encuentra el carrito, responde con 404 en ambos casos
            if (req.headers['content-type'] === 'application/json') {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            } else {
                return res.status(404).render('error', { message: 'Carrito no encontrado' });
            }
        }

        // Si es una API (Postman), responde con JSON
        if (req.headers['content-type'] === 'application/json') {
            return res.status(200).json(cart);
        }

        // Si es una solicitud desde el navegador, renderiza la vista con Handlebars
        res.status(200).render('cartDetails', { cart });

    } catch (error) {
        console.error('Error al obtener el carrito:', error);

        // Si hay un error en el servidor
        if (req.headers['content-type'] === 'application/json') {
            return res.status(500).json({ error: 'Error en el servidor' });
        } else {
            return res.status(500).render('error', { message: 'Error en el servidor' });
        }
    }
};

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
        const user = req.user; // Obtén el usuario autenticado
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Obtener el carrito asociado al usuario
        const cart = await CartModel.findOne({ userId: user._id });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        res.json(cart);
    } catch (error) {
        console.error('Error getting user cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


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