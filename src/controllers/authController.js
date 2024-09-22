import jwt from 'jsonwebtoken';
import UserModel from '../dao/models/user.model.js';
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
        const isValidPassword =  bcrypt.compare(password, user.password);
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

// Logout simplemente puede destruir el token en el frontend
export const logout = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};
