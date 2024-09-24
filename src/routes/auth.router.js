import { Router } from 'express';
import passport from 'passport';
import { login, register, logout } from '../controllers/authController.js';
import express from 'express';

const router = express.Router();

// Ruta de registro
router.post('/register', register);

// Ruta de login
router.post('/login', login);

// Ruta de logout
router.post('/logout', logout);

export default router;
