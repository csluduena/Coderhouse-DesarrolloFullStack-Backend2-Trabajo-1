import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';

class CartManager {
    async addProductToCart(userId, productId) {
        try {
            const userCart = await CartModel.findOne({ id: userId });
            if (!userCart) {
                const newCart = new CartModel({ id: userId, productos: [productId] });
                await newCart.save();
                return newCart;
            } else {
                const productAlreadyInCart = userCart.productos.includes(productId);
                if (!productAlreadyInCart) {
                    userCart.products.push(productId);
                    await userCart.save();
                    return userCart;
                } else {
                    throw new Error('Producto ya agregado al carrito');
                }
            }
        } catch (error) {
            throw error;
        }
    }

    async removeProductFromCart(userId, productId) {
        try {
            const userCart = await CartModel.findOne({ id: userId });
            if (!userCart) {
                throw new Error('Carrito no encontrado');
            } else {
                const productIndex = userCart.productos.indexOf(productId);
                if (productIndex !== -1) {
                    userCart.products.splice(productIndex, 1);
                    await userCart.save();
                    return userCart;
                } else {
                    throw new Error('Producto no encontrado en el carrito');
                }
            }
        } catch (error) {
            throw error;
        }
    }

    async getCart(userId) {
        try {
            const userCart = await CartModel.findOne({ id: userId });
            if (!userCart) {
                throw new Error('Carrito no encontrado');
            } else {
                return userCart;
            }
        } catch (error) {
            throw error;
        }
    }

    async clearCart(userId) {
        try {
            const userCart = await CartModel.findOne({ id: userId });
            if (!userCart) {
                throw new Error('Carrito no encontrado');
            } else {
                userCart.products = [];
                await userCart.save();
                return userCart;
            }
        } catch (error) {
            throw error;
        }
    }
}


export default CartManager;