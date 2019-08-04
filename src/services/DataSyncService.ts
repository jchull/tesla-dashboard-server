import {TeslaOwnerService} from './TeslaOwnerService';
import {IConfiguration} from '../model/Configuration';
import {ITeslaAccount} from '../model/TeslaAccount';
import Vehicle, {IVehicle} from '../model/Vehicle';
import VehicleState from '../model/VehicleState';
import ChargeState from '../model/ChargeState';
import DriveState from '../model/DriveState';
import ChargeSession from '../model/ChargeSession';

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
    vehicleList.forEach(async vehicle => {
      const exists = await Vehicle.exists({id_s: vehicle.id_s});
      if (exists) {
        await Vehicle.updateOne({id_s: vehicle.id_s}, vehicle);
      } else {
        await Vehicle.create(vehicle);
      }
      const handler = this.getUpdateHandler(vehicle.id_s);
      handler() && setInterval(handler, 60000);
    });
  }

  private getUpdateHandler(vehicleId: string) {
    return () => {
      // console.log('syncing vehicle data');
      return this.ownerService.getState(vehicleId)
                 .then(vehicleData => this.updateVehicleData(vehicleData));
    };
  };

  private async updateVehicleData(vehicleData: any) {
    if (vehicleData) {
      const {state, id_s, in_service} = vehicleData;
      console.log(`${vehicleData.display_name} is currently ${state} : ${vehicleData.charge_state.charging_state} : ${vehicleData.drive_state.shift_state}`);

      const vehicleState = Object.assign({}, vehicleData.vehicle_state, {
        id_s,
        state,
        in_service
      });
      delete vehicleState.speed_limit_mode;
      delete vehicleState.media_state;
      delete vehicleState.software_update;
      const lastVehicleState = await VehicleState.find({id_s})
                                                 .sort({$natural: -1})
                                                 .limit(1);
      // @ts-ignore
      if (!lastVehicleState.length || lastVehicleState[0].state !== vehicleState.state || vehicleState.in_service || vehicleData.charge_state.charging_state !== 'Disconnected') {
        await VehicleState.create(vehicleState);
        const chargeState = Object.assign({}, vehicleData.charge_state, {id_s});
        const persistedChargeState = await ChargeState.create(chargeState);

        const driveState = Object.assign({}, vehicleData.drive_state, {id_s});
        await DriveState.create(driveState);
        console.log('persisted state');

        // @ts-ignore
        if (persistedChargeState.charging_state === 'Charging') {
          const activeChargeSessions = await ChargeSession.find({id_s})
                                                         .sort({$natural: -1})
                                                         .limit(1)
                                                         .populate('chargeStates');
          if (activeChargeSessions.length) {
            // @ts-ignore
            const lastChargeState = activeChargeSessions[0].chargeStates[activeChargeSessions[0].chargeStates.length -1];
            if (!lastChargeState || chargeState.timestamp - lastChargeState.timestamp < (120000)) {
              // @ts-ignore
              activeChargeSessions[0].chargeStates.push(persistedChargeState);
              // @ts-ignore
              await ChargeSession.updateOne({_id: activeChargeSessions[0]._id}, activeChargeSessions[0]);
              console.log('added state to charge session');
            }
          } else {
            await ChargeSession.create({start_date: new Date(), id_s, chargeStates: [persistedChargeState]});
            console.log('new charging session started');
          }
        } else {
          // if there is an unclosed charging
        }

      } else {
        console.log('discarded state');
      }


      // TODO: need to filter data that is persisted, some of it hardly ever updates
      // ClimateState.create(vehicleData.climate_state);
      // VehicleConfig.create(vehicleData.vehicle_config);
      // console.log('data persisted');
    }
  }
}

