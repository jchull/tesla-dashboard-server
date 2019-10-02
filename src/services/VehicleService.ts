import {
  ChargeSession,
  ChargeState,
  DriveSession,
  DriveState,
  GuiSettings,
  SyncPreferences,
  SyncPreferencesType,
  Vehicle,
  VehicleConfig,
  VehicleType
} from '../model';
import {ISyncPreferences, IVehicle} from 'tesla-dashboard-api';


export class VehicleService {

  constructor() {
  }


  async get(vin: string): Promise<VehicleType | undefined> {
    const vehicle = await Vehicle.findOne({vin})
                                 .populate(['sync_preferences']);
    if (vehicle) {
      return vehicle as VehicleType;
    }
  }

  async findMy(username: string): Promise<[VehicleType] | undefined> {
    const vehicles = await Vehicle.find({username})
                                  .populate(['sync_preferences'])
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


  async updateSyncPreferences(vehicle: IVehicle, prefs: ISyncPreferences): Promise<ISyncPreferences | undefined> {
    if (vehicle) {
      const id_s = vehicle.id_s;
      if (prefs._id === 'default') {
        delete prefs._id;
      }
      if (!prefs._id) {
        vehicle.sync_preferences = <SyncPreferencesType>await SyncPreferences.create(prefs);
        await Vehicle.updateOne({id_s}, vehicle);
      } else if (!vehicle.sync_preferences || vehicle.sync_preferences._id !== prefs._id) {
        await SyncPreferences.updateOne({_id: prefs._id}, prefs);
        vehicle.sync_preferences = prefs;
        await Vehicle.updateOne({id_s}, vehicle);
      }
      return vehicle.sync_preferences;
    }
  }

  async delete(vin: string) {
    if (vin) {
      const vehicle = await this.get(vin);
      if (vehicle) {
        const id_s = vehicle.id_s;
        const deletions = await Promise.all([
          Vehicle.findOneAndDelete({vin}),
          ChargeState.deleteMany({vin}),
          DriveState.deleteMany({vin}),
          GuiSettings.deleteMany({id_s}),
          VehicleConfig.deleteMany({id_s}),
          ChargeSession.deleteMany({vehicle}),
          DriveSession.deleteMany({vehicle})
        ]);
        // @ts-ignore
        return deletions.reduce((acc, cur) => acc + (cur && cur.deletedCount || 0), 0);

      }
      return 0;
    }
  }


  async findAll(): Promise<[VehicleType] | undefined> {
    const vehicles = await Vehicle.find()
                                  .populate(['sync_preferences']);
    if (vehicles) {
      return vehicles as [VehicleType];
    }
  }
}

