import {NextFunction, Request, Response} from 'express';
import {ChargeSession, ChargeSessionType, ChargeState, DriveSession, DriveSessionType, DriveState} from '../model';
import {BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNAUTHORIZED} from 'http-status-codes';
import {SyncPreferences, DriveSession as IDriveSession, ChargeSession as IChargeSession} from 'tesla-dashboard-api';
import {Route} from '../util';

type VehicleSession = IDriveSession | IChargeSession;
export function getVehicleRoutes(services: any): Route[] {
  return [
    {
      path: '/vehicle',
      method: 'get',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const username = res.getHeader('username') as string;
        if (!username) {
          return res.status(UNAUTHORIZED)
                    .end();
        }
        const vehicles = await services.vs.findMy(username);
        if (vehicles) {
          res.status(OK)
                    .json(vehicles);
        }
        // no vehicles found, see if we have tesla account and get vehicles
        if (username) {
          const teslaAccounts = await services.userService.getTeslaAccounts(username);
          if (teslaAccounts && teslaAccounts.length) {
            // TODO:  teslaAccounts.forEach(account => )
          } else {

          }
        }

        return res.status(NOT_FOUND)
                  .end();

      }
    },
    {
      path: '/vehicle/:id',
      method: 'get',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {id} = req.params;
        const vehicle = await services.vs.getById(id);
        res.status(OK)
                  .json(vehicle);

        // TODO: 404
      }
    },
    {
      path: '/vehicle/:vin/sync',
      method: 'get',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const vin = req.params.vin;
        // TODO: get sync service status and return
        const status = services.ssm.status(vin);
        res.status(OK)
                  .send(status);
      }
    },
    {
      path: '/vehicle/:id/sync',
      method: 'put',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const vin = req.params.vin;
        const vehicle = await services.vs.get(vin);

        if (vehicle) {
          const prefs = req.body as SyncPreferences;
          if (prefs) {
            const updated = await services.vs.updateSyncPreferences(vehicle, prefs);
            res.status(OK)
                      .json(updated);
          }
        }

        // TODO: start/stop/reload sync service
        res.status(NOT_FOUND)
                  .end();
      }
    },
    {
      path: '/vehicle/:id',
      method: 'put',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const vehicle = await services.vs.create(req.body);
        res.status(OK)
                  .json(vehicle);
      }
    },
    {
      path: '/vehicle/:id',
      method: 'delete',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {id} = req.params;
        if (id) {
          const deletedCount = await services.vs.deleteById(id);
          res.status(OK)
                    .send(`vehicle and data deleted ${deletedCount} documents`);
        } else {
          res.status(BAD_REQUEST)
                    .send('VIN is required');
        }
      }
    },


    ///// Sessions (Drive+Charge)
    {
      path: '/vehicle/:id/session',
      method: 'get',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const limit = req.query.limit && Number(req.query.limit) || 1;
        const {id} = req.params;
        const vehicle = await services.vs.getById(id);
        const driveSessions = await DriveSession.find({vehicle})
                                                .sort({$natural: -1})
                                                .limit(limit)
                                                .populate(['first', 'last', 'vehicle']);
        const chargeSessions = await ChargeSession.find({vehicle})
                                                  .sort({$natural: -1})
                                                  .limit(limit)
                                                  .populate(['first', 'last', 'vehicle']);
        const sessions = [...driveSessions, ...chargeSessions]
                                      .sort((a: VehicleSession, b: VehicleSession) => b.start_date - a.start_date)// reverse sort
                                      .slice(0, limit);
        if (sessions.length) {
          res.status(OK)
                    .json(sessions);
        } else {
          res.status(INTERNAL_SERVER_ERROR)
                    .end();
        }
      }
    },

    {
      path: '/vehicle/:id/session',
      method: 'post',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        //const limit = req.query.limit && Number(req.query.limit) || 1;
        //const {vin} = req.params;
        const {filters} = req.body;
        const sessions = await services.vs.filteredSessions(filters);
        // const driveSessions = await DriveSession.find({vehicle})
        //                                         .sort({$natural: -1})
        //                                         .limit(limit)
        //                                         .populate(['first', 'last', 'vehicle']);
        // const chargeSessions = await ChargeSession.find({vehicle})
        //                                           .sort({$natural: -1})
        //                                           .limit(limit)
        //                                           .populate(['first', 'last', 'vehicle']);
        // const sessions = driveSessions.concat(chargeSessions)
        //                               // @ts-ignore
        //                               .sort((a: IVehicleSession, b: IVehicleSession) => b.start_date - a.start_date)// reverse sort
        //                               .slice(0, limit);
        if (sessions.length) {
          res.status(OK)
                    .json(sessions);
        } else {
          res.status(INTERNAL_SERVER_ERROR)
                    .end();
        }
      }
    },

    {
      path: '/session/:sessionId/tag',
      method: 'get',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {sessionId, tag} = req.params;
        const driveSession = await DriveSession.findOne({_id: sessionId});
        if (driveSession ) {
          res.status(OK)
             .json(driveSession.tags);
        } else {
          const chargeSession = await ChargeSession.findOne({_id: sessionId});
          if (chargeSession) {
            res.status(OK)
               .json(chargeSession.tags);
          } else {
            res.status(NOT_FOUND)
               .end();
          }
        }
      }
    },
    {
      path: '/session/:sessionId/tag/:tag',
      method: 'post',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {sessionId, tag} = req.params;
        const driveSession = await DriveSession.findOne({_id: sessionId});
        if (driveSession && !driveSession.tags.includes(tag)) {
          driveSession.tags.push(tag);
          await DriveSession.updateOne({_id: sessionId}, driveSession);
          res.status(OK)
                    .json(driveSession.tags);
        } else {
          const chargeSession = await ChargeSession.findOne({_id: sessionId});
          if (chargeSession && !chargeSession.tags.includes(tag)) {
            chargeSession.tags.push(tag);
            await ChargeSession.updateOne({_id:sessionId}, chargeSession);
            res.status(OK)
                      .json(chargeSession.tags);
          } else {
            res.status(INTERNAL_SERVER_ERROR)
               .end();
          }
        }
      }
    },
    {
      path: '/session/:sessionId/tag/:tag',
      method: 'delete',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {sessionId, tag} = req.params;
        const driveSession = await DriveSession.findOne({_id: sessionId});
        if (driveSession && driveSession.tags.includes(tag)) {
          driveSession.tags.splice(driveSession.tags.indexOf(tag), 1);
          await DriveSession.updateOne({sessionId}, driveSession);
          res.status(OK)
                    .json(driveSession.tags);
        } else {
          const chargeSession = await ChargeSession.findOne({_id: sessionId});
          if (chargeSession && chargeSession.tags.includes(tag)) {
            chargeSession.tags.slice(chargeSession.tags.indexOf(tag), 1);
            await ChargeSession.updateOne({sessionId}, chargeSession);
            res.status(OK)
                      .json(chargeSession.tags);
          } else {
            res.status(INTERNAL_SERVER_ERROR)
               .end();
          }
        }

      }
    },


    ///// DRIVING
    {
      path: '/vehicle/:vin/drive',
      method: 'get',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const vehicle = await services.vs.get(req.params.vin);
        const driveSessions = await DriveSession.find({vehicle})
                                                .sort({timestamp: -1})
                                                .limit(req.query.limit && Number(req.query.limit) || 1)
                                                .populate(['first', 'last', 'vehicle']);
        if (driveSessions.length) {
          res.status(OK)
                    .json(driveSessions);
        } else {
          res.status(NOT_FOUND)
                    .end();
        }
      }
    },
    {
      path: '/session/:sessionId',
      method: 'get',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {sessionId} = req.params;
        const driveStates = await DriveState.find({driveSession: sessionId})
                                            .sort({timestamp: 1});
        if (driveStates.length) {
          res.status(OK)
                    .json(driveStates);
        } else {
          const chargeStates = await ChargeState.find({chargeSession: sessionId})
                                                     .sort({timestamp: 1});
          if(chargeStates.length){
            res.status(OK)
                      .json(chargeStates);
          } else {
            res.status(NOT_FOUND)
               .end();
          }
        }

      }
    },


    /////// CHARGING
    {
      path: '/vehicle/:vin/charge',
      method: 'get',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const vehicle = await services.vs.get(req.params.vin);
        const chargeSessions = await ChargeSession.find({vehicle})
                                                  .sort({timestamp: -1})
                                                  .limit(req.query.limit && Number(req.query.limit) || 1)
                                                  .populate(['first', 'last', 'vehicle']);
        if (chargeSessions.length) {
          res.status(OK)
                    .json(chargeSessions);
        } else {
          res.status(NOT_FOUND)
                    .end();
        }
      }
    },
    {
      path: '/vehicle/:vin/charge/:charge_id',
      method: 'get',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const chargeStates = await ChargeState.find({chargeSession: req.params.charge_id})
                                              .sort({timestamp: 1});
        if (chargeStates.length) {
          res.status(OK)
                    .json(chargeStates);
        } else {
          res.status(NOT_FOUND)
                    .end();
        }
      }
    },
    {
      path: '/vehicle/:vin/session/merge',
      method: 'post',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const sessionIds = req.body.sessionIds;
        // get all the sessions in sessionIds
        // delete all states that are not a first or last for one of the sessions
        // update the sessionIds for all the old first/last to point to new sessionId
        // update the last to point to the new last sessionId
        // delete old sessions?


        res.status(OK)
                  .end();
      }
    },
    {
      path: '/vehicle/:vin/session/:sessionId/archive',
      method: 'post',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // get the session
        // delete all states that are not a first or last for that session

        res.status(OK)
                  .end();
      }
    },

    {
      path: '/vehicle/:vin/session/:sessionId',
      method: 'delete',
      handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const _id = req.params.sessionId;
        const deleteCount = await DriveSession.deleteOne({_id});
        if (deleteCount.ok) {
          const deleteItemCount = await DriveState.deleteMany({driveSession: _id});
          if(deleteItemCount.ok){
            const total = (deleteCount.n || 0) + (deleteItemCount.n || 0);
            res.status(OK)
                .json(total);
          }
        } else {
          const deleteCount = await ChargeSession.deleteOne({_id});
          if (deleteCount.ok) {
            const deleteItemCount = await ChargeState.deleteMany({chargeSession: _id});
            if(deleteItemCount.ok){
              const total = (deleteCount.n || 0) + (deleteItemCount.n || 0);
              res.status(OK)
                  .json(total);
            }
          }
        }
        res.status(INTERNAL_SERVER_ERROR)
            .end();
      }
    }
  ];
}




