import {TeslaOwnerService} from './TeslaOwnerService';
import {IConfiguration} from '../model/Configuration';
import {ITeslaAccount} from '../model/TeslaAccount';
import Vehicle, {IVehicle} from '../model/Vehicle';
import VehicleState from '../model/VehicleState';
import ChargeState from '../model/ChargeState';
import DriveState from '../model/DriveState';
import ClimateState from '../model/ClimateState';
import VehicleConfig from '../model/VehicleConfig';
import GuiSettings from '../model/GuiSettings';

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
    vehicleList.forEach(vehicle => {
      Vehicle.updateOne({id_s: vehicle.id_s}, vehicle);
      const handler = this.getUpdateHandler(vehicle.id_s);
      handler() && setInterval(handler, 60000);
    });
  }

  private getUpdateHandler(vehicleId: string) {
    return () => {
      console.log('syncing vehicle data');
      return this.ownerService.getState(vehicleId)
                 // @ts-ignore
                 .then(vehicleData => {
                   if (vehicleData) {
                     const vehicleState = Object.assign({}, vehicleData.vehicle_state, {id_s: vehicleData.id_s});
                     delete vehicleState.speed_limit_mode;
                     delete vehicleState.media_state;
                     delete vehicleState.software_update;
                     VehicleState.create(vehicleState);

                     const chargeState = Object.assign({}, vehicleData.charge_state, {id_s: vehicleData.id_s});
                     ChargeState.create(chargeState);

                     const driveState = Object.assign({}, vehicleData.drive_state, {id_s: vehicleData.id_s});
                     DriveState.create(driveState);

                     // TODO: need to filter data that is persisted, some of it hardly ever updates
                     // ClimateState.create(vehicleData.climate_state);
                     // VehicleConfig.create(vehicleData.vehicle_config);
                     console.log('data persisted');
                   }
                 });
    };
  };
}

