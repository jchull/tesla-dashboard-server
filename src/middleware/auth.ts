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
    res.header('Content-Type', 'application/json;charset=UTF-8');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    const whitelisted = whitelist.find(allowed => req.url.endsWith(allowed));

    if (whitelisted) {
      next();
    } else {
      try {
        const token = jwtService.decode(req.cookies[JWT_COOKIE_PROP]);
        if (!token) {
          throw Error('JWT not present in signed cookie.');
        }
        res.header('username', token.username);
        next();
      } catch (err) {
        return res.status(UNAUTHORIZED)
                  .json({
                    error: err.message
                  });
      }
    }
  };
};
