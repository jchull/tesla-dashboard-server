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
import {SyncPreferences as ISyncPreferences, Vehicle as Product} from 'tesla-dashboard-api';


export class VehicleService {

  constructor() {
  }


  async get(vin: string): Promise<VehicleType | undefined> {
    const vehicle = await Vehicle.findOne({vin})
                                 .populate(['sync_preferences']);
    if (vehicle) {
      return vehicle;
    }
  }

  async getById(id: string): Promise<VehicleType | undefined> {
    const vehicle = await Vehicle.findOne({_id: id})
                                 .populate(['sync_preferences']);
    if (vehicle) {
      return vehicle;
    }
  }

  async findMy(username: string): Promise<VehicleType[] | undefined> {
    const vehicles = await Vehicle.find({username})
                                  .populate(['sync_preferences'])
                                  .sort({$natural: -1});
    if (vehicles) {
      return vehicles;
    }
  }

  async filteredSessions(filters:any){

  }

  async create(vehicle: Product): Promise<VehicleType | undefined> {
    const newVehicle = await Vehicle.create(vehicle);
    if (newVehicle) {
      return newVehicle;
    }
  }

  async update(vehicle: Product): Promise<VehicleType | undefined> {
    return Vehicle.updateOne({id_s: vehicle.id_s}, vehicle);
  }


  async updateSyncPreferences(vehicle: Product, prefs: ISyncPreferences): Promise<ISyncPreferences | undefined> {
    if (vehicle) {
      const id_s = vehicle.id_s;
      if (prefs._id === 'default') {
        delete prefs._id;
      }
      if (!prefs._id) {
        vehicle.sync_preferences = await SyncPreferences.create(prefs);
        await Vehicle.updateOne({id_s}, vehicle);
      } else if (!vehicle.sync_preferences || vehicle.sync_preferences._id !== prefs._id) {
        await SyncPreferences.updateOne({_id: prefs._id}, prefs);
        vehicle.sync_preferences = prefs;
        await Vehicle.updateOne({id_s}, vehicle);
      }
      return vehicle.sync_preferences;
    }
  }

  async deleteById(id: string) {
    const vehicle = await this.getById(id);
    if(vehicle){
      return this.delete(vehicle.vin);
    }
    return 0;
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


  async findAll(): Promise<VehicleType[] | undefined> {
    const vehicles = await Vehicle.find()
                                  .populate(['sync_preferences']);
    if (vehicles) {
      return vehicles;
    }
  }
}

