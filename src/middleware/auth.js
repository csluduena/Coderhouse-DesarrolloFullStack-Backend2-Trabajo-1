// import passport from 'passport';
// import jwt from 'jsonwebtoken';

// let revokedTokens = []; // Array para almacenar tokens revocados

// export const authenticateJWT = (req, res, next) => {
//     passport.authenticate('jwt', { session: false }, (err, user, info) => {
//         if (err || !user) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         // Verifica si el token está revocado
//         const token = req.headers['authorization']?.split(' ')[1];
//         if (revokedTokens.includes(token)) {
//             return res.status(403).json({ message: 'Token revocado' });
//         }

//         req.user = user; // Agrega el usuario a la solicitud
//         next(); // Llama a la siguiente función de middleware
//     })(req, res, next);
// };

// // Función para revocar el token
// export const revokeToken = (token) => {
//     revokedTokens.push(token);
// };

// const verifyToken = (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ error: 'No se proporciona token' });
//     }

//     if (revokedTokens.includes(token)) {
//         return res.status(403).json({ error: 'Debe iniciar Sesión de nuevo' }); // Token revocado
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             return res.status(403).json({ error: 'Token inválido' });
//         }
//         req.user = user; 
//         next();
//     });
// };

// export default verifyToken;


import passport from 'passport';
import jwt from 'jsonwebtoken';

let revokedTokens = []; // Array para almacenar tokens revocados

// Middleware para autenticar el token JWT
export const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Usuario decodificado:', decoded); // Log de usuario decodificado
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido.' });
    }
};

// export const authenticateJWT = (req, res, next) => {
//     passport.authenticate('jwt', { session: false }, (err, user, info) => {
//         if (err) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }
//         if (!user) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         // Verifica si el token está revocado
//         const token = req.headers['authorization']?.split(' ')[1];
//         if (revokedTokens.includes(token)) {
//             return res.status(403).json({ message: 'Token revocado' });
//         }

//         req.user = user; // Agrega el usuario a la solicitud
//         next(); // Llama a la siguiente función de middleware
//     })(req, res, next);
// };

// Función para revocar el token
export const revokeToken = (token) => {
    revokedTokens.push(token);
};

// Si decides utilizar esta función, asegúrate de que se use en lugar de authenticateJWT
export const verifyToken = (req, res, next) => {
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

export default authenticateJWT; // Exporta el middleware de autenticación