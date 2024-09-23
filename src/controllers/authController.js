import jwt from 'jsonwebtoken';
import UserModel from '../dao/models/user.model.js';
import CartModel from '../dao/models/cart.model.js';
import bcrypt from 'bcrypt';

// Login usando JWT
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        console.log('Usuario encontrado:', user);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verificamos la contraseña
        const isValidPassword = await bcrypt.compare(password, user.password); // <--- Agregado await
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generamos el token JWT
        const token = jwt.sign({ sub: user._id, user }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ first_name, last_name, email, age, password: hashedPassword });
        await user.save();

        // Crear un carrito para el usuario
        const cart = new CartModel({ userId: user._id });
        await cart.save();

        // Asignar el carrito al usuario
        user.cart = cart._id;
        await user.save();

        const token = jwt.sign({ sub: user._id, user }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        console.error('Error creando usuario:', error);
        res.status(500).json({ error: 'Error creando usuario' });
    }
};

// Logout simplemente puede destruir el token en el frontend
export const logout = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};
