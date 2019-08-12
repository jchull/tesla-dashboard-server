import {TeslaOwnerService} from './TeslaOwnerService';
import {IConfiguration} from '../model/Configuration';
import {ITeslaAccount} from '../model/TeslaAccount';
import Vehicle, {IVehicle} from '../model/tesla/Vehicle';
import ChargeState, {IChargeState} from '../model/ChargeState';
import DriveState, {IDriveState} from '../model/DriveState';
import ChargeSession, {IChargeSession} from '../model/ChargeSession';
import DriveSession, {IDriveSession} from '../model/DriveSession';
import {IVehicleData} from '../model/tesla/VehicleData';

export class DataSyncService {
  private config: IConfiguration;
  private ownerService: TeslaOwnerService;

  constructor(config: IConfiguration, teslaAccount: ITeslaAccount) {
    this.config = config;
    this.ownerService = new TeslaOwnerService(config.ownerBaseUrl, config.teslaClientKey, config.teslaClientSecret, teslaAccount);
  }


  public beginPolling(pollingInterval: number): void {
    console.log(`Polling started every ${pollingInterval / 1000} seconds...`);
    this.ownerService.checkToken()
        .then(() => this.ownerService.getVehicles())
        .then((vehicleList: Array<IVehicle>) => this.updateVehicles(vehicleList));

  };

  public async updateVehicleData(vehicleData: IVehicleData): Promise<void> {
    if (vehicleData) {
      const {state, id_s} = vehicleData;
      const vehicleStatus = this.findVehicleState(vehicleData);
      console.log(`${vehicleData.display_name} is currently ${vehicleStatus}`);

      const vehicle = <IVehicle>await Vehicle.findOne({id_s});
      vehicle.odometer = vehicleData.vehicle_state.odometer;
      vehicle.display_name = vehicleData.display_name;
      vehicle.api_version = vehicleData.api_version;
      vehicle.color = vehicleData.vehicle_config.exterior_color;
      vehicle.car_type = vehicleData.vehicle_config.car_type;
      vehicle.timestamp = vehicleData.vehicle_state.timestamp;
      vehicle.battery_level = vehicleData.charge_state.battery_level;
      vehicle.state = vehicleStatus;
      await Vehicle.updateOne({id_s}, vehicle);

      if (this.isCharging(vehicleData)) {
        // If this vehicle has a ChargeSession updated in the last 15 minutes, consider it the same charge
        let [activeChargingSession] = await ChargeSession.find({
                                                           id_s,
                                                           end_date: {
                                                             $gte: new Date(vehicleData.charge_state.timestamp - (60 * 15 * 1000))
                                                           }
                                                         })
                                                         .sort({$natural: -1})
                                                         .limit(1) as [IChargeSession];
        if (!activeChargingSession) {
          activeChargingSession = <IChargeSession>await ChargeSession.create({
            id_s,
            start_date: vehicleData.charge_state.timestamp,
            end_date: vehicleData.charge_state.timestamp,
            latitude: vehicleData.drive_state.latitude,
            longitude: vehicleData.drive_state.longitude
          });
          console.log(`*** Started new charging session at ${vehicleData.charge_state.battery_level}% ***`);
        }

        this.appendChargeState(activeChargingSession, vehicleData);

      } else if (this.isDriving(vehicleData)) {
        // If this vehicle has an a DriveSession updated in the last 15 minutes, consider it the same drive
        let [activeDrivingSession] = await DriveSession.find({
                                                         id_s,
                                                         end_date: {
                                                           $gte: new Date(vehicleData.drive_state.timestamp - (60 * 15 * 1000))
                                                         }
                                                       })
                                                       .sort({$natural: -1})
                                                       .limit(1) as [IDriveSession];
        if (!activeDrivingSession) {
          activeDrivingSession = <IDriveSession>await DriveSession.create({
            id_s,
            start_date: vehicleData.drive_state.timestamp,
            end_date: vehicleData.drive_state.timestamp
          });
          console.log(`*** Started new driving session at ${vehicleData.vehicle_state.odometer} miles ***`);
        }

        this.appendDriveState(activeDrivingSession, vehicleData);
      } else {
        console.log('state discarded');
      }
    }
  }

  private updateVehicles(vehicleList: Array<IVehicle>): void {
    vehicleList.forEach(async vehicle => {
      const exists = await Vehicle.exists({id_s: vehicle.id_s});
      if (!exists) {
        await Vehicle.create(vehicle);
      }
      const handler = this.getUpdateHandler(vehicle.id_s);
      handler() && setInterval(handler, 60000);
    });
  }

  private getUpdateHandler(vehicleId: String) {
    return () => {
      return this.ownerService.getState(vehicleId)
                 .then(vehicleData => this.updateVehicleData(vehicleData));
    };
  };

  private hasChanges(existing: IChargeState, incoming: IVehicleData): boolean {
    return existing.charge_energy_added !== incoming.charge_state.charge_energy_added &&
        existing.est_battery_range !== incoming.charge_state.est_battery_range &&
        existing.charger_power !== incoming.charge_state.charger_power &&
        existing.battery_level !== incoming.charge_state.battery_level &&
        existing.charger_voltage !== incoming.charge_state.charger_voltage &&
        existing.charge_rate !== incoming.charge_state.charge_rate &&
        existing.charger_actual_current !== incoming.charge_state.charger_actual_current;
  }

  private async appendChargeState(session: IChargeSession, vehicleData: IVehicleData): Promise<any> {
    if (!session.last || this.hasChanges(session.last, vehicleData)) {
      const id_s = vehicleData.id_s;

      const state = <IChargeState>await ChargeState.create({
        id_s,
        battery_heater_on: vehicleData.charge_state.battery_heater_on || false,
        battery_level: vehicleData.charge_state.battery_level,
        battery_range: vehicleData.charge_state.battery_range,
        charge_current_request: vehicleData.charge_state.charge_current_request,
        charge_energy_added: vehicleData.charge_state.charge_energy_added,
        charge_miles_added_ideal: vehicleData.charge_state.charge_miles_added_ideal,
        charge_miles_added_rated: vehicleData.charge_state.charge_miles_added_rated,
        charge_port_door_open: vehicleData.charge_state.charge_port_door_open,
        charge_port_latch: vehicleData.charge_state.charge_port_latch,
        charge_rate: vehicleData.charge_state.charge_rate,
        charger_actual_current: vehicleData.charge_state.charger_actual_current,
        charger_power: vehicleData.charge_state.charger_power || 0,
        charger_voltage: vehicleData.charge_state.charger_voltage || 0,
        charging_state: vehicleData.charge_state.charging_state || 'Disconnected',
        est_battery_range: vehicleData.charge_state.est_battery_range,
        ideal_battery_range: vehicleData.charge_state.ideal_battery_range,
        time_to_full_charge: vehicleData.charge_state.time_to_full_charge || 0,
        timestamp: vehicleData.charge_state.timestamp,
        driver_temp_setting: vehicleData.climate_state.driver_temp_setting,
        fan_status: vehicleData.climate_state.fan_status || 0,
        inside_temp: vehicleData.climate_state.inside_temp,
        is_auto_conditioning_on: vehicleData.climate_state.is_auto_conditioning_on,
        is_climate_on: vehicleData.climate_state.is_climate_on || undefined,
        is_front_defroster_on: vehicleData.climate_state.is_front_defroster_on || undefined,
        is_preconditioning: vehicleData.climate_state.is_preconditioning || undefined,
        is_rear_defroster_on: vehicleData.climate_state.is_rear_defroster_on || undefined,
        outside_temp: vehicleData.climate_state.outside_temp,
        passenger_temp_setting: vehicleData.climate_state.passenger_temp_setting,
        seat_heater_left: vehicleData.climate_state.seat_heater_left,
        seat_heater_rear_center: vehicleData.climate_state.seat_heater_rear_center,
        seat_heater_rear_left: vehicleData.climate_state.seat_heater_rear_left,
        seat_heater_rear_right: vehicleData.climate_state.seat_heater_rear_right,
        seat_heater_right: vehicleData.climate_state.seat_heater_right,
        side_mirror_heaters: vehicleData.climate_state.side_mirror_heaters,
        smart_preconditioning: vehicleData.climate_state.smart_preconditioning,
        is_user_present: vehicleData.vehicle_state.is_user_present || undefined,
        chargeSession: session
      });

      if (!session.first) {
        session.first = state;
      }
      session.last = state;
      session.trip_charging = session.trip_charging || vehicleData.charge_state.trip_charging || false;
      session.end_date = state.timestamp;
      session.charge_current_request_max = vehicleData.charge_state.charge_current_request_max;
      session.charge_enable_request = vehicleData.charge_state.charge_enable_request;
      session.charge_limit_soc = vehicleData.charge_state.charge_limit_soc;
      session.charge_limit_soc_max = vehicleData.charge_state.charge_limit_soc_max;
      session.charge_limit_soc_min = vehicleData.charge_state.charge_limit_soc_min;
      session.charge_limit_soc_std = vehicleData.charge_state.charge_limit_soc_std;
      session.charge_port_cold_weather_mode = vehicleData.charge_state.charge_port_cold_weather_mode;
      session.charge_to_max_range = session.charge_to_max_range || vehicleData.charge_state.charge_to_max_range || false;
      session.charger_phases = vehicleData.charge_state.charger_phases;
      session.charger_pilot_current = vehicleData.charge_state.charger_pilot_current;
      session.conn_charge_cable = vehicleData.charge_state.conn_charge_cable;
      session.fast_charger_brand = vehicleData.charge_state.fast_charger_brand;
      session.fast_charger_present = vehicleData.charge_state.fast_charger_present || false;
      session.fast_charger_type = vehicleData.charge_state.fast_charger_type;
      session.managed_charging_active = vehicleData.charge_state.managed_charging_active;
      session.managed_charging_start_time = vehicleData.charge_state.managed_charging_start_time;
      session.managed_charging_user_canceled = vehicleData.charge_state.managed_charging_user_canceled;
      session.max_range_charge_counter = vehicleData.charge_state.max_range_charge_counter;
      session.scheduled_charging_pending = vehicleData.charge_state.scheduled_charging_pending;
      session.scheduled_charging_start_time = vehicleData.charge_state.scheduled_charging_start_time;

      console.log(`appending charge state`);
      await ChargeSession.updateOne({_id: session._id}, session);
    } else {
      console.log('No Changes detected');
    }
  }

  private async appendDriveState(session: IDriveSession, vehicleData: IVehicleData): Promise<any> {
    const id_s = vehicleData.id_s;
    const state = <IDriveState>await DriveState.create({
      id_s,
      gps_as_of: vehicleData.drive_state.gps_as_of,
      heading: vehicleData.drive_state.heading,
      latitude: vehicleData.drive_state.latitude,
      longitude: vehicleData.drive_state.longitude,
      power: vehicleData.drive_state.power,
      shift_state: vehicleData.drive_state.shift_state,
      speed: vehicleData.drive_state.speed,
      odometer: vehicleData.vehicle_state.odometer,
      timestamp: vehicleData.drive_state.timestamp,
      battery_heater: vehicleData.climate_state.battery_heater,
      battery_level: vehicleData.charge_state.battery_level,
      est_battery_range: vehicleData.charge_state.est_battery_range,
      ideal_battery_range: vehicleData.charge_state.ideal_battery_range,
      usable_battery_level: vehicleData.charge_state.usable_battery_level,
      driver_temp_setting: vehicleData.climate_state.driver_temp_setting,
      fan_status: vehicleData.climate_state.fan_status,
      inside_temp: vehicleData.climate_state.inside_temp,
      is_auto_conditioning_on: vehicleData.climate_state.is_auto_conditioning_on,
      is_climate_on: vehicleData.climate_state.is_climate_on,
      is_front_defroster_on: vehicleData.climate_state.is_front_defroster_on,
      is_preconditioning: vehicleData.climate_state.is_preconditioning,
      is_rear_defroster_on: vehicleData.climate_state.is_rear_defroster_on,
      outside_temp: vehicleData.climate_state.outside_temp,
      passenger_temp_setting: vehicleData.climate_state.passenger_temp_setting,
      seat_heater_left: vehicleData.climate_state.seat_heater_left,
      seat_heater_rear_center: vehicleData.climate_state.seat_heater_rear_center,
      seat_heater_rear_left: vehicleData.climate_state.seat_heater_rear_left,
      seat_heater_rear_right: vehicleData.climate_state.seat_heater_rear_right,
      seat_heater_right: vehicleData.climate_state.seat_heater_right,
      side_mirror_heaters: vehicleData.climate_state.side_mirror_heaters,
      smart_preconditioning: vehicleData.climate_state.is_preconditioning,
      wiper_blade_heater: vehicleData.climate_state.wiper_blade_heater,
      driveSession: session
    });

    if (!session.first) {
      session.first = state;
    }
    session.last = state;
    session.end_date = session.last.timestamp;
    session.distance = session.last.odometer - session.first.odometer;

    const vehicle = <IVehicle>await Vehicle.findOne({id_s});
    if (vehicle) {
      vehicle.odometer = state.odometer;
      vehicle.display_name = vehicleData.display_name;
      vehicle.api_version = vehicleData.api_version;
      vehicle.color = vehicleData.vehicle_config.exterior_color;
      vehicle.car_type = vehicleData.vehicle_config.car_type;
      vehicle.timestamp = state.timestamp;
      await Vehicle.updateOne({id_s}, vehicle);
    }

    console.log(`appending drive state`);
    return DriveSession.updateOne({_id: session._id}, session);
  }

  private isCharging(vehicleData: IVehicleData): boolean {
    return vehicleData.charge_state.charging_state === 'Charging';
  }

  private isDriving(vehicleData: IVehicleData): boolean {
    return vehicleData.drive_state.shift_state !== null;
  }

  private findVehicleState(vehicleData: IVehicleData): string {
    if (vehicleData.drive_state.shift_state) {
      return 'Driving';
    }
    if (vehicleData.charge_state.charging_state && vehicleData.charge_state.charging_state !== 'Disconnected') {
      return vehicleData.charge_state.charging_state;
    }
    return 'Parked';
  }
}

