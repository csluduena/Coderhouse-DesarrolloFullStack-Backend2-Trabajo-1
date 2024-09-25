import passport from 'passport';
import jwt from 'jsonwebtoken';

let revokedTokens = []; // Array para almacenar tokens revocados

export const authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verifica si el token está revocado
        const token = req.headers['authorization']?.split(' ')[1];
        if (revokedTokens.includes(token)) {
            return res.status(403).json({ message: 'Token revocado' });
        }

        req.user = user; // Agrega el usuario a la solicitud
        next(); // Llama a la siguiente función de middleware
    })(req, res, next);
};

// Función para revocar el token
export const revokeToken = (token) => {
    revokedTokens.push(token);
};

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No se proporciona token' });
    }

    if (revokedTokens.includes(token)) {
        return res.status(403).json({ error: 'Debe iniciar Sesión de nuevo' }); // Token revocado
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user; 
        next();
    });
};

export default verifyToken;

// import jwt from 'jsonwebtoken';

// export function isAuthenticated(req, res, next) {
//     const token = req.headers.authorization?.split(' ')[1]; // Buscar el token en el header Authorization
//     if (!token) {
//         return res.redirect('/login');
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded.user; // Pasar los datos del usuario a req.user
//         next();
//     } catch (error) {
//         return res.status(401).send('Token inválido');
//     }
// }

// app.post('/login', async (req, res, next) => {
//     console.log('Request Body:', req.body); // Agrega esto para depuración
//     passport.authenticate('local', (err, user, info) => {
//         if (err) {
//             return next(err); // Manejo de errores
//         }
//         if (!user) {
//             return res.status(401).send('Invalid credentials'); // Usuario no encontrado
//         }
//         req.logIn(user, (err) => {
//             if (err) {
//                 return next(err); // Manejo de errores
//             }
//             return res.redirect('/'); // Redireccionar al inicio
//         });
//     })(req, res, next);
// });

