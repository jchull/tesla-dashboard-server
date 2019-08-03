import {Request, Response} from 'express';

const routes = [{
  path: '/admin',
  method: 'get',
  handler: async (req: Request, res: Response) => {
    res.send('No Admin');
  }
}];

export default [...routes];
