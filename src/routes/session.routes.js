import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import User from '../models/user.model.js';
import { createHash, isValidPassword } from "../utils/util.js";
import { config } from "dotenv";
import CartManager from "../dao/db/cartManagerDb.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import { register, login, logout, getCurrentUser } from '../controllers/user.controller.js';
import { ERROR_CODES, ERROR_MESSAGES } from '../utils/errorCodes.js';

config();

const router = Router();
const jwtSecret = process.env.JWT_SECRET;
const manager = new CartManager();

const registerRedirect = '/api/sessions/current';
const loginRedirect = '/api/sessions/current';

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/current", isAuthenticated, (req, res) => {
    res.render('current-session', { user: req.user });
});

router.get('/current-api', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(ERROR_CODES.UNAUTHORIZED);

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(ERROR_CODES.FORBIDDEN);
        res.json({ user });
    });
});

// Obtener la información del usuario actual
router.get("/user", isAuthenticated, (req, res) => {
    res.json({ user: req.user });
});

// Register
router.post("/register", async (req, res) => {
    const token = req.cookies['token'];
    if (token) {
        jwt.verify(token, jwtSecret);
        return res.redirect('/api/sessions/current');
    }

    const { name, lastName, email, password, age } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(ERROR_CODES.BAD_REQUEST).send(ERROR_MESSAGES.USER_ALREADY_EXISTS);
        }

        const user = new User({
            name,
            lastName,
            email,
            password: createHash(password),
            age
        });
        await user.save();

        const newCart = new Cart({ user: user._id, items: [] });
        await newCart.save();

        user.cart = newCart._id;
        await user.save();

        const token = jwt.sign(
            { userId: user._id, name: user.name, lastName: user.lastName, email: user.email, age: user.age, cart: user.cart },
            jwtSecret,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000,
        });

        // Enviar el token en la respuesta antes de redirigir
        res.status(200).json({
            message: "User registered successfully",
            token: token,
            redirectUrl: '/api/sessions/current'
        });
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).send(ERROR_MESSAGES.SERVER_ERROR);
    }
});

// Login
router.post("/login", async (req, res) => {
    if (req.user && req.user.role === 'admin') {
        return res.redirect('/api/sessions/current')
    }

    const token = req.cookies['token'];
    if (token) {
        jwt.verify(token, jwtSecret);
        return res.redirect('/api/sessions/current');
    }

    const { email, password } = req.body;

    try {
        const foundUser = await userModel.findOne({ email });

        if (!foundUser) {
            return res.status(ERROR_CODES.UNAUTHORIZED).send(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        if (!isValidPassword(password, foundUser)) {
            return res.status(ERROR_CODES.UNAUTHORIZED).send(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        if (!foundUser.cart) {
            const newCart = await manager.addCart();
            foundUser.cart = newCart._id;
            await foundUser.save();
        }

        const token = jwt.sign(
            { name: foundUser.name, lastName: foundUser.lastName, role: foundUser.role, email: foundUser.email, age: foundUser.age, cart: foundUser.cart },
            jwtSecret,
            { expiresIn: "1h" }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000,
        }).redirect('/api/sessions/current');
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).send(ERROR_MESSAGES.SERVER_ERROR);
    }
});

// Logout
router.post('/logout', async (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

// Current
router.get('/current', isAuthenticated, (req, res) => {
    res.json({ user: req.user });
});

// Admin
router.get('/admin', passport.authenticate('current', { session: false }), async (req, res) => {
    if (req.user.role !== 'admin') return res.status(ERROR_CODES.FORBIDDEN).send(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
    console.log(req.cookies['token']);

    res.render('realTimeProducts', { user: req.user });
})

// Home products
router.get('/', (req, res, next) => {
    passport.authenticate('current', { session: false }, async (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(ERROR_CODES.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
        }
        req.user = user;
        const cart = await manager.getCartById(req.user.cart);
        return res.send({ user: req.user, cart: cart });
    })(req, res, next);
});

// Carrito
router.get('/cart', passport.authenticate('current', { session: false }), async (req, res) => {
    const cart = await manager.getCartById(req.user.cart);
    res.render('cart', { cartId: req.user.cart, products: cart.products });
})

export default router;
