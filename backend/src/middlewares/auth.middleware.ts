import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
        return res.status(401).json({ message: "Ban chua dang nhap"});
    }

    try {
        const secret = process.env.JWT_SECRET || 'secret_key_cua_ban';
        const decoded = jwt.verify(token, secret);

        (req as any).user = decoded;
        next();
    }
    catch(error){
        return res.status(403).json({ message: "token khong hop le hoac da het han"});
    }
};