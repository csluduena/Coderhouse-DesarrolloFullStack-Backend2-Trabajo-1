import passport from 'passport';
import { Strategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import UserModel from '../dao/models/user.model.js';


passport.use('jwt', new Strategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: (req) => {
        const authorization = req.headers.authorization;
        if (authorization && authorization.startsWith('Bearer ')) {
            return authorization.substring(7);
        }
        return null;
    },
}, async (payload, done) => {
    try {
        const user = await UserModel.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }

}));

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.use('current', new Strategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: (req) => {
        const authorization = req.headers.authorization;
        if (authorization && authorization.startsWith('Bearer ')) {
            return authorization.substring(7);
        }
        return null;
    },
    ignoreExpiration: true,
}, async (payload, done) => {
    try {
        const user = await UserModel.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));


export default passport;