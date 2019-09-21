import {
  ChargeSession,
  ChargeState,
  DriveSession,
  DriveState,
  GuiSettings,
  Vehicle,
  VehicleConfig,
  VehicleType
} from '../model';
import {IVehicle} from 'tesla-dashboard-api';


export class VehicleService {

  constructor() {
  }


  async get(id_s: string): Promise<VehicleType | undefined> {
    const vehicle = await Vehicle.findOne({id_s})
                                 .populate(['sync_preferences']);
    if (vehicle) {
      return vehicle as VehicleType;
    }
  }

  async findMy(username: string): Promise<[VehicleType] | undefined> {
    const vehicles = await Vehicle.find({username})
                                  .sort({$natural: -1});
    if (vehicles) {
      return vehicles as [VehicleType];
    }
  }

  async create(vehicle: IVehicle): Promise<VehicleType | undefined> {
    const newVehicle = await Vehicle.create(vehicle);
    if (newVehicle) {
      return newVehicle as VehicleType;
    }
  }

  async update(vehicle: IVehicle): Promise<VehicleType | undefined> {
    return Vehicle.updateOne({id_s: vehicle.id_s}, vehicle);
  }

  async delete(id_s: string) {
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
      return deletions.reduce((acc, cur) => acc + (cur && cur.deletedCount || 0), 0);
    }
  }


  async findAll(): Promise<[VehicleType] | undefined> {
    const vehicles = await Vehicle.find();
    if (vehicles) {
      return vehicles as [VehicleType];
    }
  }
}

