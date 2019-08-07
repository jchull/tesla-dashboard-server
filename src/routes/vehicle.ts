import {Request, Response} from 'express';
import Vehicle from '../model/tesla/Vehicle';
import ChargeState from '../model/ChargeState';
import DriveState from '../model/DriveState';
import GuiSettings from '../model/tesla/GuiSettings';
import VehicleConfig from '../model/tesla/VehicleConfig';
import ChargeSession from '../model/ChargeSession';
import DriveSession from '../model/DriveSession';

const routes = [
  {
    path: '/vehicle',
    method: 'get',
    handler: async (req: Request, res: Response) => {
      const vehicles = await Vehicle.find();
      res.status(200)
         .json(vehicles);
    }
  },
  {
    path: '/vehicle/:id_s',
    method: 'get',
    handler: async (req: Request, res: Response) => {
      const id_s = req.params.id_s;
      const vehicle = await Vehicle.find({id_s});
      res.status(200)
         .json(vehicle);

      // TODO: 404
    }
  },
  {
    path: '/vehicle/:id_s',
    method: 'put',
    handler: async (req: Request, res: Response) => {
      const vehicle = await Vehicle.create(req.body);
      console.log(`Vehicle created: ${vehicle}`);
      res.status(200)
         .json(vehicle);
    }
  },
  {
    path: '/vehicle/:id_s',
    method: 'delete',
    handler: async (req: Request, res: Response) => {
      const id_s = req.params.id_s;
      if (id_s) {
        const deletions = await Promise.all([
          Vehicle.findOneAndDelete({id_s}),
          ChargeState.deleteMany({id_s}),
          DriveState.deleteMany({id_s}),
          GuiSettings.deleteMany({id_s}),
          VehicleConfig.deleteMany({id_s}),
          ChargeSession.deleteMany({id_s}),
          DriveSession.deleteMany({id_s})
        ]);

        // @ts-ignore
        const deletedCount: number = deletions.reduce((acc, cur) => acc + (cur && cur.deletedCount || 0), 0);
        res.status(200)
           .send(`vehicle and data deleted ${deletedCount} documents`);
      } else {
        res.status(406)
           .send('Vehicle ID is required to be provided as :id_s');
      }
    }
  },
  {
    path: '/vehicle/:id_s/drive',
    method: 'get',
    handler: async (req: Request, res: Response) => {
      const driveSessions = await DriveSession.find({id_s: req.params.id_s})
                                              .sort({$natural: -1})
                                              .limit(req.query.limit && Number(req.query.limit) || 1)
                                              .populate(['first', 'last']);
      if (driveSessions.length) {
        res.status(200)
           .json(driveSessions);
      } else {
        res.status(500)
           .send();
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
        res.status(200)
           .json(driveStates);
      } else {
        res.status(500)
           .send();
      }
    }
  },
  {
    path: '/vehicle/:id_s/charge',
    method: 'get',
    handler: async (req: Request, res: Response) => {
      const chargeSessions = await ChargeSession.find({id_s: req.params.id_s})
                                                .sort({$natural: -1})
                                                .limit(req.query.limit && Number(req.query.limit) || 1)
                                                .populate(['first', 'last']);
      if (chargeSessions.length) {
        res.status(200)
           .json(chargeSessions);
      } else {
        res.status(500)
           .send();
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
        res.status(200)
           .json(chargeStates);
      } else {
        res.status(500)
           .send();
      }
    }
  }
];

export default [...routes];
