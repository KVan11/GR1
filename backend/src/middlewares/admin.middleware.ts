import { Request, Response, NextFunction } from 'express';

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any). user;

    if(user && user.roleId === 1) {
        next();
    }
    else {
        return res.status(403).json({ message: `Ban khong co quyen truy cap` });
    }
}