import {Request, Response} from 'express';

const routes = [
  {
    path: '/user',
    method: 'get',
    handler: async (req: Request, res: Response) => {
      res.send('No users');
    }
  }
];

export default [...routes];
