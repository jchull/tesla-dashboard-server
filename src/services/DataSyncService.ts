import {TeslaOwnerService} from './TeslaOwnerService';
import {IConfiguration} from '../model/Configuration';
import {ITeslaAccount} from '../model/TeslaAccount';
import {IVehicle} from '../model/Vehicle';
import VehicleState from '../model/VehicleState';
import ChargeState from '../model/ChargeState';
import DriveState from '../model/DriveState';
import ClimateState from '../model/ClimateState';

export class DataSyncService {
  private config: IConfiguration;
  private ownerService: TeslaOwnerService;

  constructor(config: IConfiguration, teslaAccount: ITeslaAccount) {
    this.config = config;
    this.ownerService = new TeslaOwnerService(config.ownerBaseUrl, config.teslaClientKey, config.teslaClientSecret, teslaAccount);
  }


  public beginPolling(pollingInterval: number) {
    console.log(`Polling started every ${pollingInterval / 1000} seconds...`);
    // @ts-ignore
    this.ownerService.checkToken()
        .then(() => this.ownerService.getVehicles())
        // TODO: handle errors
        .then((vehicleList: Array<IVehicle>) => this.updateVehicles(vehicleList));

  };

  private updateVehicles(vehicleList: Array<IVehicle>) {
    // Vehicle.updateOne({id_s: })
    const handlers = vehicleList.map(vehicle => this.getUpdateHandler(vehicle.id_s));
    handlers.forEach(handler => handler() && setInterval(handler, 60000));
  }

  private getUpdateHandler(vehicleId: string) {
    return () => {
      console.log('syncing vehicle data');
      return this.ownerService.getState(vehicleId)
                 // @ts-ignore
                 .then(vehicleData => {
                   if (vehicleData) {
                     const vehicleState = Object.assign({}, vehicleData.vehicle_state);
                     delete vehicleState.speed_limit_mode;
                     delete vehicleState.media_state;
                     delete vehicleState.software_update;
                     VehicleState.create(vehicleState);
                     ChargeState.create(vehicleData.charge_state);
                     DriveState.create(vehicleData.drive_state);
                     ClimateState.create(vehicleData.climate_state);
                     console.log('data persisted');
                   }
                 });
    };
  };
}

