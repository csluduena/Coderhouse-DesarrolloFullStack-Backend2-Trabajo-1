import passport from 'passport';

export const authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user; // Agregamos el usuario a la solicitud para que esté disponible en la siguiente función
        next(); // Llamamos a la siguiente función de middleware
    })(req, res, next);
};

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

