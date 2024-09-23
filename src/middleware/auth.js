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