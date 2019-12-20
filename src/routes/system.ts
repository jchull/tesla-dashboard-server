import {NextFunction, Request, Response} from 'express';
import {NOT_FOUND, OK} from 'http-status-codes';
import {Route} from '../util';
import {ServicesType} from '../services';
import {PersistenceService} from '../services/PersistenceService';

export function getSystemRoutes(services: ServicesType): Route[] {
  return [
    {
      path: '/configuration',
      method: 'get',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const config = await PersistenceService.getConfiguration();
        if(config){
          // @ts-ignore
          return res.status(OK).json(config);
        } else {
          return res.status(NOT_FOUND)
             .end();
        }
      }
    },

  ];
}




