import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { config } from "dotenv";
import User from '../models/user.model.js';
config();

const jwtSecret = process.env.JWT_SECRET;

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};

const JWTOpctions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: jwtSecret
};

const initializePassport = () => {
    passport.use("current", new JwtStrategy(JWTOpctions, async (jwt_payload, done) => {
        try {
            // The entire user object (except password) is now in jwt_payload
            return done(null, jwt_payload);
        } catch (error) {
            return done(error, false);
        }
    }));
};

export default initializePassport;
