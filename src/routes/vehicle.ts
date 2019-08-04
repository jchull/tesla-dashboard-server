import {Request, Response} from 'express';
import Vehicle from '../model/Vehicle';
import VehicleState from '../model/VehicleState';
import ChargeState from '../model/ChargeState';
import ClimateState from '../model/ClimateState';
import DriveState from '../model/DriveState';

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
      await Vehicle.findOneAndDelete({id_s});
      res.status(200)
         .send('vehicle deleted');
    }
  },
  {
    path: '/vehicle/:id_s/vehicle_state',
    method: 'get',
    handler: async (req: Request, res: Response) => {
      const vehicleStates = await VehicleState.find({id_s: req.params.id_s});
      if (vehicleStates) {
        res.status(200)
           .json(vehicleStates);
      } else {
        res.status(500)
           .json(vehicleStates);
      }
    }
  },
  {
    path: '/vehicle/:id_s/vehicle_state',
    method: 'put',
    handler: async (req: Request, res: Response) => {
      const vehicleState = await VehicleState.create(req.body);
      if (!vehicleState.errors && vehicleState.id) {
        res.status(200)
           .json(vehicleState);
      } else {
        res.status(500)
           .json(vehicleState.errors);
      }
    }
  },
  {
    path: '/vehicle/:id_s/charge_state',
    method: 'get',
    handler: async (req: Request, res: Response) => {
      const chargeStates = await ChargeState.find({id_s: req.params.id_s});
      if (chargeStates) {
        res.status(200)
           .json(chargeStates);
      } else {
        res.status(500)
           .json(chargeStates);
      }
    }
  },
  {
    path: '/vehicle/:id_s/charge_state',
    method: 'put',
    handler: async (req: Request, res: Response) => {
      const chargeState = await ChargeState.create(req.body);
      if (!chargeState.errors && chargeState.id) {
        res.status(200)
           .json(chargeState);
      } else {
        res.status(500)
           .json(chargeState.errors);
      }
    }
  },
  {
    path: '/vehicle/:id_s/climate_state',
    method: 'get',
    handler: async (req: Request, res: Response) => {
      const climateStates = await ClimateState.find({id_s: req.params.id_s});
      if (climateStates) {
        res.status(200)
           .json(climateStates);
      } else {
        res.status(500)
           .json(climateStates);
      }
    }
  },
  {
    path: '/vehicle/:id_s/climate_state',
    method: 'put',
    handler: async (req: Request, res: Response) => {
      const climateState = await ClimateState.create(req.body);
      if (!climateState.errors && climateState.id) {
        res.status(200)
           .json(climateState);
      } else {
        res.status(500)
           .json(climateState.errors);
      }
    }
  },
  {
    path: '/vehicle/:id_s/drive_state',
    method: 'get',
    handler: async (req: Request, res: Response) => {
      const driveStates = await DriveState.find({id_s: req.params.id_s});
      if (driveStates) {
        res.status(200)
           .json(driveStates);
      } else {
        res.status(500)
           .json(driveStates);
      }
    }
  },
  {
    path: '/vehicle/:id_s/drive_state',
    method: 'put',
    handler: async (req: Request, res: Response) => {
      const driveState = await DriveState.create(req.body);
      if (!driveState.errors && driveState.id) {
        res.status(200)
           .json(driveState);
      } else {
        res.status(500)
           .json(driveState.errors);
      }
    }
  }
];

export default [...routes];
