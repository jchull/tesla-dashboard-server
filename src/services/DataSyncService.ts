import {TeslaOwnerService} from './TeslaOwnerService';
import {IConfiguration} from '../model/Configuration';
import {ITeslaAccount} from '../model/TeslaAccount';
import Vehicle, {IVehicle} from '../model/Vehicle';
import ChargeState from '../model/ChargeState';
import DriveState from '../model/DriveState';
import ChargeSession from '../model/ChargeSession';
import DriveSession from '../model/DriveSession';

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

  private getUpdateHandler(vehicleId: String) {
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

      // @ts-ignore
      if (!lastVehicleState.length || lastVehicleState[0].state !== vehicleState.state || vehicleData.charge_state.charging_state !== 'Disconnected') {
// TODO: this is wrong now
        const lastVehicleState = await ChargeState.find({id_s})
                                                   .sort({$natural: -1})
                                                   .limit(1);
        const chargeState = await ChargeState.create(Object.assign({}, vehicleData.charge_state, {id_s}));
        const driveState = await DriveState.create(Object.assign({}, vehicleData.drive_state, {id_s}));

        // @ts-ignore
        if (chargeState.charging_state === 'Charging') {
          const activeChargeSessions = await ChargeSession.find({id_s})
                                                          .sort({$natural: -1})
                                                          .limit(1)
                                                          .populate({
                                                            path: 'chargeStates',
                                                            options: {sort: {'timestamp': -1}}
                                                          });
          // @ts-ignore
          if (activeChargeSessions.length && chargeState.timestamp - activeChargeSessions[0].chargeStates[0].timestamp < 120000) {
            // @ts-ignore
            activeChargeSessions[0].chargeStates.push(chargeState);
            // @ts-ignore
            await ChargeSession.updateOne({_id: activeChargeSessions[0]._id}, activeChargeSessions[0]);
            console.log('added state to charge session');
          } else {
            await ChargeSession.create({start_date: new Date(), id_s, chargeStates: [chargeState]});
            // @ts-ignore
            console.log(`new charging session started with battery at ${chargeState.battery_level}%`);
          }
        }else if (vehicleState.state) {
          const activeDrivingSessions = await DriveSession.find({id_s})
                                                          .sort({$natural: -1})
                                                          .limit(1)
                                                          .populate({
                                                            path: 'driveStates',
                                                            options: {sort: {'timestamp': -1}}
                                                          });
          // @ts-ignore
          if (activeDrivingSessions.length && driveState.timestamp - activeDrivingSessions[0].driveStates[0].timestamp < 120000) {
            // @ts-ignore
            activeDrivingSessions[0].driveStates.push(driveState);
            // @ts-ignore
            await DriveSession.updateOne({_id: activeDrivingSessions[0]._id}, activeDrivingSessions[0]);
            console.log('added state to charge session');
          } else {
            await DriveSession.create({start_date: new Date(), id_s, driveStates: [driveState]});
            // @ts-ignore
            console.log(`new driving session started with battery at ${chargeState.battery_level}%`);
          }

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

