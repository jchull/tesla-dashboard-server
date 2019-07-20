import productRoutes from './products';
import userRoutes from './users';

import {Request, Response} from 'express';

const home = {
  path: '/',
  method: 'get',
  handler: async (req: Request, res: Response) => {
    res.send('You have landed at the API root, there are no services here.');
  }
};

export default [home, ...productRoutes, ...userRoutes];

