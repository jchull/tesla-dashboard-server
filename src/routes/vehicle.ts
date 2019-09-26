import {Request, Response} from 'express';
import {ChargeSession, ChargeSessionType, ChargeState, DriveSession, DriveSessionType, DriveState} from '../model';
import {BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNAUTHORIZED} from 'http-status-codes';
import {ISyncPreferences} from 'tesla-dashboard-api';
import {Route} from '../util';


export function getVehicleRoutes(services: any): Route[] {
  return [
    {
      path: '/vehicle',
      method: 'get',
      handler: async (req: Request, res: Response) => {
        const username = res.getHeader('username') as string;
        if (!username) {
          return res.status(UNAUTHORIZED)
                    .end();
        }
        const vehicles = await services.vs.findMy(username);
        if (vehicles) {
          return res.status(OK)
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
      path: '/vehicle/:id_s',
      method: 'get',
      handler: async (req: Request, res: Response) => {
        const id_s = req.params.id_s;
        const vehicle = await services.vs.get(id_s);
        return res.status(OK)
                  .json(vehicle);

        // TODO: 404
      }
    },
    {
      path: '/vehicle/:id_s/sync',
      method: 'get',
      handler: async (req: Request, res: Response) => {
        const id_s = req.params.id_s;
        // TODO: get sync service status and return
        const status = services.ssm.status(id_s);
        return res.status(OK)
                  .send(status);
      }
    },
    {
      path: '/vehicle/:id_s/sync',
      method: 'put',
      handler: async (req: Request, res: Response) => {
        const id_s = req.params.id_s;
        const vehicle = await services.vs.get(id_s);

        if (vehicle) {
          const prefs = req.body as ISyncPreferences;
          if (prefs) {
            const updated = await services.vs.updateSyncPreferences(vehicle, prefs);
            return res.status(OK)
                      .json(updated);
          }
        }

        // TODO: start/stop/reload sync service
        return res.status(NOT_FOUND)
                  .end();
      }
    },
    {
      path: '/vehicle/:id_s',
      method: 'put',
      handler: async (req: Request, res: Response) => {
        const vehicle = await services.vs.create(req.body);
        return res.status(OK)
                  .json(vehicle);
      }
    },
    {
      path: '/vehicle/:id_s',
      method: 'delete',
      handler: async (req: Request, res: Response) => {
        const id_s = req.params.id_s;
        if (id_s) {
          const deletedCount = await services.vs.delete(id_s);
          return res.status(OK)
                    .send(`vehicle and data deleted ${deletedCount} documents`);
        } else {
          return res.status(BAD_REQUEST)
                    .send('Vehicle ID is required to be provided as :id_s');
        }
      }
    },


    ///// Sessions (Drive+Charge)
    {
      path: '/vehicle/:id_s/session',
      method: 'get',
      handler: async (req: Request, res: Response) => {
        const limit = req.query.limit && Number(req.query.limit) || 1;
        const driveSessions = await DriveSession.find({id_s: req.params.id_s})
                                                .sort({$natural: -1})
                                                .limit(limit)
                                                .populate(['first', 'last']);
        const chargeSessions = await ChargeSession.find({id_s: req.params.id_s})
                                                  .sort({$natural: -1})
                                                  .limit(limit)
                                                  .populate(['first', 'last']);
        const sessions = driveSessions.concat(chargeSessions)
                                      // @ts-ignore
                                      .sort((a: IVehicleSession, b: IVehicleSession) => b.start_date - a.start_date)// reverse sort
                                      .slice(0, limit);
        if (sessions.length) {
          return res.status(OK)
                    .json(sessions);
        } else {
          return res.status(INTERNAL_SERVER_ERROR)
                    .end();
        }
      }
    },

    {
      path: '/vehicle/:id_s/session/:_id/tag/:tag',
      method: 'post',
      handler: async (req: Request, res: Response) => {
        const {_id, tag} = req.params;
        const driveSession = <DriveSessionType>await DriveSession.findOne({_id});
        if (driveSession && !driveSession.tags.includes(tag)) {
          driveSession.tags.push(tag);
          await DriveSession.updateOne({_id}, driveSession);
          return res.status(OK)
                    .json(driveSession.tags);
        } else {
          const chargeSession = <ChargeSessionType>await ChargeSession.findOne({_id});
          if (chargeSession && !chargeSession.tags.includes(tag)) {
            chargeSession.tags.push(tag);
            await ChargeSession.updateOne({_id}, chargeSession);
            return res.status(OK)
                      .json(chargeSession.tags);
          }
        }
        return res.status(INTERNAL_SERVER_ERROR)
                  .end();
      }
    },
    {
      path: '/vehicle/:id_s/session/:_id/tag/:tag',
      method: 'delete',
      handler: async (req: Request, res: Response) => {
        const {_id, tag} = req.params;
        const driveSession = <DriveSessionType>await DriveSession.findOne({_id});
        if (driveSession && driveSession.tags.includes(tag)) {
          driveSession.tags.splice(driveSession.tags.indexOf(tag), 1);
          await DriveSession.updateOne({_id}, driveSession);
          return res.status(OK)
                    .json(driveSession.tags);
        } else {
          const chargeSession = <ChargeSessionType>await ChargeSession.findOne({_id});
          if (chargeSession && chargeSession.tags.includes(tag)) {
            chargeSession.tags.slice(chargeSession.tags.indexOf(tag), 1);
            await ChargeSession.updateOne({_id}, chargeSession);
            return res.status(OK)
                      .json(chargeSession.tags);
          }
        }
        return res.status(INTERNAL_SERVER_ERROR)
                  .end();
      }
    },


    ///// DRIVING
    {
      path: '/vehicle/:id_s/drive',
      method: 'get',
      handler: async (req: Request, res: Response) => {
        const driveSessions = await DriveSession.find({id_s: req.params.id_s})
                                                .sort({$natural: -1})
                                                .limit(req.query.limit && Number(req.query.limit) || 1)
                                                .populate(['first', 'last']);
        if (driveSessions.length) {
          return res.status(OK)
                    .json(driveSessions);
        } else {
          return res.status(NOT_FOUND)
                    .end();
        }
      }
    },
    {
      path: '/vehicle/:id_s/drive/:drive_id',
      method: 'get',
      handler: async (req: Request, res: Response) => {
        const driveStates = await DriveState.find({id_s: req.params.id_s, driveSession: req.params.drive_id})
                                            .sort({$natural: 1});
        if (driveStates.length) {
          return res.status(OK)
                    .json(driveStates);
        } else {
          return res.status(NOT_FOUND)
                    .end();
        }
      }
    },
    {
      path: '/vehicle/:id_s/drive/:drive_id',
      method: 'delete',
      handler: async (req: Request, res: Response) => {
        await DriveSession.findOneAndDelete({_id: req.params.drive_id});
        return res.status(OK)
                  .end();
      }
    },


    /////// CHARGING
    {
      path: '/vehicle/:id_s/charge',
      method: 'get',
      handler: async (req: Request, res: Response) => {
        const chargeSessions = await ChargeSession.find({id_s: req.params.id_s})
                                                  .sort({$natural: -1})
                                                  .limit(req.query.limit && Number(req.query.limit) || 1)
                                                  .populate(['first', 'last']);
        if (chargeSessions.length) {
          return res.status(OK)
                    .json(chargeSessions);
        } else {
          return res.status(NOT_FOUND)
                    .end();
        }
      }
    },
    {
      path: '/vehicle/:id_s/charge/:charge_id',
      method: 'get',
      handler: async (req: Request, res: Response) => {
        const chargeStates = await ChargeState.find({id_s: req.params.id_s, chargeSession: req.params.charge_id})
                                              .sort({$natural: 1});
        if (chargeStates.length) {
          return res.status(OK)
                    .json(chargeStates);
        } else {
          return res.status(NOT_FOUND)
                    .end();
        }
      }
    },
    {
      path: '/vehicle/:id_s/charge/:charge_id',
      method: 'delete',
      handler: async (req: Request, res: Response) => {
        await ChargeSession.findOneAndDelete({_id: req.params.charge_id});
        return res.status(OK)
                  .end();
      }
    },
    {
      path: '/vehicle/:id_s/session/merge',
      method: 'post',
      handler: async (req: Request, res: Response) => {
        const sessionIds = req.body.sessionIds as [string];
        // get all the sessions in sessionIds
        // delete all states that are not a first or last for one of the sessions
        // update the sessionIds for all the old first/last to point to new sessionId
        // update the last to point to the new last sessionId
        // delete old sessions?


        return res.status(OK)
                  .end();
      }
    },
    {
      path: '/vehicle/:id_s/session/:sessionId/archive',
      method: 'post',
      handler: async (req: Request, res: Response) => {
        // get the session
        // delete all states that are not a first or last for that session

        return res.status(OK)
                  .end();
      }
    }
  ] as Route[];
}




