import {NextFunction, Request, Response} from 'express';
import {UNAUTHORIZED} from 'http-status-codes';
import {jwt, JWT_COOKIE_PROP} from '../services/JwtService';

const jwtService = jwt();

// bypass token check for these
const whitelist = [
  '/signup',
  '/login'
];

export default (): (req: Request, res: Response, next: NextFunction) => Promise<any> => {
  return async function (req: Request, res: Response, next: NextFunction) {
    whitelist.forEach(allowed => {
      if (req.url.endsWith(allowed)) {
        next();
      }
    });


    try {
      const token = jwtService.decode(req.cookies[JWT_COOKIE_PROP]);
      if (!token) {
        throw Error('JWT not present in signed cookie.');
      }
      console.log(`Got TOKEN: ${token}`);
      next();
    } catch (err) {
      return res.status(UNAUTHORIZED)
                .json({
                  error: err.message
                });
    }
  };
};
