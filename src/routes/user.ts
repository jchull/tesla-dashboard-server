import {Request, Response} from 'express';
import User from '../model/User';
import TeslaAccount from '../model/TeslaAccount';

const routes = [
  {
    path: '/user/:username',
    method: 'get',
    handler: async (req: Request, res: Response) => {
      res.send('No users');
    }
  },
  {
    path: '/user',
    method: 'post',
    handler: async (req: Request, res: Response) => {
      const teslaAccounts = await TeslaAccount.create(req.body.teslaAccounts);
      const userInfo = Object.assign({}, req.body, {teslaAccounts});
      const user = await User.create(userInfo);
      res.status(200).json(user);
    }
  }
];

export default [...routes];
