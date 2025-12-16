import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends Request {
    userId?: number;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        // Accept token from Authorization header (Bearer), cookie `token`, or raw Cookie header
        let token: string | undefined;

        if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
            token = authHeader.substring(7);
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.cookie) {
            // Fallback: parse raw Cookie header (simple parser)
            const cookies = req.headers.cookie.split(';').map(c => c.trim()).reduce((acc: Record<string,string>, cur) => {
                const eq = cur.indexOf('=');
                if (eq === -1) return acc;
                const key = cur.substring(0, eq).trim();
                const val = cur.substring(eq + 1).trim();
                acc[key] = decodeURIComponent(val);
                return acc;
            }, {});
            if (cookies.token) token = cookies.token;
        }

        if (!token) {
            return res.status(401).json({ success: false, result: 'Unauthorized: No token provided' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
            req.userId = decoded.userId;
            next();
        } catch (error) {
            return res.status(401).json({ success: false, result: 'Unauthorized: Invalid token' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, result: 'Server error' });
    }
};

export const generateToken = (userId: number): string => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};
