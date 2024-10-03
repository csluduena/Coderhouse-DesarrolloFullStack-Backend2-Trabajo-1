import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register, isAuthenticated);
router.post('/login', login, isAuthenticated);
router.get('/profile', isAuthenticated, getProfile);
router.put('/profile', isAuthenticated, updateProfile);

router.delete('/', isAuthenticated, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.userId);
        res.clearCookie('token');
        res.status(200).json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;