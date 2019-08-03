import {Request, Response} from 'express';

const routes = [
  {
    path: '/user/:username',
    method: 'get',
    handler: async (req: Request, res: Response) => {
      res.send('No users');
    }
  },
  {
    path: '/user/',
    method: 'post',
    handler: async (req: Request, res: Response) => {

    }
  }
];

export default [...routes];
