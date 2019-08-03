import productRoutes from './product';
import userRoutes from './user';
import adminRoutes from './admin'
import vehicleRoutes from './vehicle';

import {Request, Response} from 'express';

const home = {
  path: '/',
  method: 'get',
  handler: async (req: Request, res: Response) => {
    res.send('You have landed at the API root, there are no services here.');
  }
};

export default [home, ...productRoutes, ...userRoutes, ...adminRoutes, ...vehicleRoutes];

