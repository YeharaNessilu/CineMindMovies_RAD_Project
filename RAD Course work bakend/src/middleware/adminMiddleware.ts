import { Request, Response, NextFunction } from 'express';

// Request එකේ user ඉන්නවා කියලා TypeScript වලට කියනවා
interface AuthRequest extends Request {
  user?: any;
}

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  // User කෙනෙක් ඉන්නවද සහ එයාගේ Role එක 'admin' ද කියලා බලනවා
  if (req.user && req.user.role === 'admin') {
    next(); // Admin නම් ඇතුලට යන්න දෙනවා
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' }); // නැත්නම් එලවනවා
  }
};