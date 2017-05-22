import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../entity/User';

export function authUser(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;

  jwt.verify(token, req.app.get('jwt-secret'), {}, (err, decoded) => {
    req.user = decoded;
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
}

export interface AuthRequest extends Request {
  user: User;
}