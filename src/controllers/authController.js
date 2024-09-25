import jwt from 'jsonwebtoken';
import UserModel from '../dao/models/user.model.js';
import CartModel from '../dao/models/cart.model.js'; // Importa el modelo de carrito
import bcrypt from 'bcrypt';
import { revokeToken } from '../middleware/auth.js';


// Lógica de login (de código A)
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        console.log('Usuario encontrado:', user);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isValidPassword = bcrypt.compare(password, user.password); 
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ sub: user._id, user }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Lógica de registro
export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const user = new UserModel({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
        });

        // Guardar el nuevo usuario
        await user.save();

        // Crear un carrito asociado al nuevo usuario
        const cart = new CartModel({ userId: user._id });
        await cart.save();

        // Asignar el ID del carrito al usuario y guardar nuevamente
        user.cart = cart._id;
        await user.save();

        // Generar token JWT si es necesario
        const token = jwt.sign({ sub: user._id, user }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Si es una API, responde con JSON
        if (req.headers['content-type'] === 'application/json') {
            return res.json({ token, user });
        }

        // Si no es API, redirige a otra vista después del registro
        res.redirect('/'); // Podrías redirigir al login o a cualquier otra página

    } catch (error) {
        console.error('Error creando usuario:', error);
        res.status(500).render('register', { error: 'Error creando usuario' });
    }
};

// // Cierra la sesión del usuario y destruye la sesión activa
// export const logout = (req, res) => {
//     try {
//         req.session.destroy((err) => {
//             if (err) {
//                 return res.status(500).json({ error: 'Error al cerrar la sesión' });
//             }
//             res.status(200).json({ message: 'Sesión cerrada exitosamente' });
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Error en el servidor' });
//     }
// };

export const logout = (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extrae el token del header

    if (token) {
        revokeToken(token); // Usa la función revokeToken
    }

    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
};

export const getCurrentSession = (req, res) => {
    if (req.user) { // Asegúrate de que la información del usuario está disponible
        return res.status(200).json(req.user); // Devuelve la información del usuario
    } else {
        return res.status(401).json({ error: 'No estás autenticado' });
    }
};