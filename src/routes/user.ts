import {Request, Response} from 'express';
import {User} from '../model/User';
import {TeslaAccount} from '../model/TeslaAccount';
import {IUserPreferences} from 'tesla-dashboard-api';

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
      // const ownerService = new TeslaOwnerService()
      // TODO: need to check token here so the tokens are saved in DB
      const userInfo = Object.assign({}, req.body, {teslaAccounts});
      const user = await User.create(userInfo);
      res.status(200)
         .json(user);
    }
  },
  {
    path: '/user',
    method: 'put',
    handler: async (req: Request, res: Response) => {
      const teslaAccounts = await TeslaAccount.create(req.body.teslaAccounts);
      // const ownerService = new TeslaOwnerService()
      // TODO: need to check token here so the tokens are saved in DB
      const userInfo = Object.assign({}, req.body, {teslaAccounts});
      const user = await User.update({username: userInfo.username}, userInfo);
      res.status(200)
         .json(user);
    }
  },
  {
    path: '/user/:username/prefs',
    method: 'get',
    handler: async (req: Request, res: Response) => {
      const x = {} as IUserPreferences;
      res.send('No users');
    }
  }
];

export default [...routes];
