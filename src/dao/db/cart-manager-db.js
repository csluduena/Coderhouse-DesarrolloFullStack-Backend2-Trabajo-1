import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';

class CartManager {
    // Otras funciones...

    async getCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.product'); // Asegúrate de que 'product' esté referenciado correctamente
            console.log('Carrito recuperado:', cart); // Agrega esta línea para depurar
            if (!cart) {
                throw new Error("Cart not found");
            }
            return cart; // Devuelve el carrito
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) { // Por defecto, quantity es 1
        // Convertimos quantity a número para asegurarnos de que siempre sea un valor numérico
        const parsedQuantity = Number(quantity);
    
        // Verificamos si parsedQuantity es un número válido
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            throw new Error('Cantidad inválida');
        }
    
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
    
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
    
        // Buscar el producto en el carrito
        const existingProduct = cart.products.find(item => item.product.toString() === productId);
    
        if (existingProduct) {
            // Si el producto ya existe en el carrito, aumentamos su cantidad
            existingProduct.quantity += parsedQuantity;  // Suma la cantidad, por defecto será 1
        } else {
            // Si el producto no está en el carrito, lo agregamos con la cantidad inicial (por defecto 1)
            cart.products.push({ product: productId, quantity: parsedQuantity });
        }
    
        // Guardamos los cambios en el carrito
        await cart.save();
        
        return cart;
    }
    
}


export default CartManager;



// import CartModel from '../models/cart.model.js';
// import ProductModel from '../models/product.model.js';

// class CartManager {
//     async addProductToCart(userId, productId) {
//         try {
//             // Buscar el carrito por userId, no por 'id'
//             const userCart = await CartModel.findOne({ userId });
//             if (!userCart) {
//                 const newCart = new CartModel({ userId, products: [{ product: productId, quantity: 1 }] });
//                 await newCart.save();
//                 return newCart;
//             } else {
//                 const productInCart = userCart.products.find(p => p.product.toString() === productId);
//                 if (!productInCart) {
//                     userCart.products.push({ product: productId, quantity: 1 });
//                 } else {
//                     productInCart.quantity += 1;
//                 }
//                 await userCart.save();
//                 return userCart;
//             }
//         } catch (error) {
//             throw error;
//         }
//     }

//     async createCart(userId) {
//         try {
//             // Comprueba si ya existe un carrito para este usuario
//             const existingCart = await CartModel.findOne({ id: userId });
//             if (existingCart) {
//                 throw new Error('El carrito ya existe para este usuario');
//             }

//             // Crea un nuevo carrito
//             const newCart = new CartModel({ id: userId, products: [] });
//             await newCart.save();
//             return newCart;
//         } catch (error) {
//             console.error('Error creando el carrito:', error);
//             throw error;
//         }
//     }

//     async removeProductFromCart(userId, productId) {
//         try {
//             const userCart = await CartModel.findOne({ id: userId });
//             if (!userCart) {
//                 throw new Error('Carrito no encontrado');
//             } else {
//                 const productIndex = userCart.productos.indexOf(productId);
//                 if (productIndex !== -1) {
//                     userCart.products.splice(productIndex, 1);
//                     await userCart.save();
//                     return userCart;
//                 } else {
//                     throw new Error('Producto no encontrado en el carrito');
//                 }
//             }
//         } catch (error) {
//             throw error;
//         }
//     }

//     async getCart(userId) {
//         try {
//             const userCart = await CartModel.findOne({ userId }).populate('products.product'); // Asegúrate de que 'userId' sea correcto
//             if (!userCart) {
//                 throw new Error('Carrito no encontrado');
//             }
//             return userCart;
//         } catch (error) {
//             throw error;
//         }
//     }
    

//     async getAllCarts() {
//         try {
//             const carts = await CartModel.find();  // Puedes agregar filtros si es necesario
//             return carts;
//         } catch (error) {
//             console.error('Error fetching carts:', error);
//             throw error;
//         }
//     }

//     async clearCart(userId) {
//         try {
//             const userCart = await CartModel.findOne({ id: userId });
//             if (!userCart) {
//                 throw new Error('Carrito no encontrado');
//             } else {
//                 userCart.products = [];
//                 await userCart.save();
//                 return userCart;
//             }
//         } catch (error) {
//             throw error;
//         }
//     }

// }

// export default CartManager;