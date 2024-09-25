import { Router } from 'express';
import passport from 'passport';
import { login, register, logout, getCurrentSession } from '../controllers/authController.js';
import express from 'express';
import verifyToken from '../middleware/auth.js'; 

const router = express.Router();

// Ruta de registro
router.post('/register', register);

// Ruta de login
router.post('/login', login);

// Ruta para cerrar sesión
router.post('/logout', logout);

// Ruta para obtener la sesión actual con el middleware de verificación de token
router.get('/current', verifyToken, getCurrentSession);




export default router;
