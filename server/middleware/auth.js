import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default async function Auth(req, res, next){
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodeToken;

        next();
    } catch (error) {
        res.status(401).json({error: "Authentication Failed"})
    }
}

export function localVariables(req, res, next){
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next()
}