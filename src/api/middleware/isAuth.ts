import config from '@/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, config.token.accessTokenSecret);

      req.token = decodedToken;
    }
    return next();
  } catch (e) {
    return next(e);
  }
};
