import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config();

const jwtSecret = process.env.JWT_SECRET;

export const isAuthenticated = (req, res, next) => {
    const token = req.cookies['token'];
    if (!token) {
        return res.status(401).redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie('token');
        return res.status(401).redirect('/login');
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Acceso denegado. Se requieren permisos de administrador." });
    }
};

export const checkUserSession = (req, res, next) => {
    const token = req.cookies['token'];

    if (!token) {
        return next();
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return next();
        }

        return res.redirect('/api/sessions/current');
    });
};