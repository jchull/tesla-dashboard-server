import {Document, model, Schema} from 'mongoose';

export interface IChargeSession extends Document {
  id_s: String,
  vehicle_id: number,
  start_date: Date,
  end_date: Date,
  duration_minutes: number, // at end of charge
  latitude: number,
  longitude: number,
  odometer: number,
  battery_range: number, // at end of charge
  charge_current_request_max: number,
  charge_enable_request: boolean,
  charge_limit_soc: number,
  charge_limit_soc_max: number,
  charge_limit_soc_min: number,
  charge_limit_soc_std: number,
  charge_miles_added_ideal: number, // at end of charge
  charge_miles_added_rated: number, // at end of charge
  charge_port_cold_weather_mode: boolean,
  charge_to_max_range: boolean,
  charger_phases: number,
  charger_pilot_current: number,
  conn_charge_cable: String,
  fast_charger_brand: String,
  fast_charger_present: boolean,
  fast_charger_type: String,
  managed_charging_active: boolean,
  managed_charging_start_time: number,
  managed_charging_user_canceled: boolean,
  max_range_charge_counter: number, // end of charge
  scheduled_charging_pending: boolean,
  scheduled_charging_start_time: number,
  trip_charging: boolean
}


const ChargeSessionSchema: Schema = new Schema({
  id_s: {type: String, required: true},
  vehicle_id: {type: Number},
  start_date: {type: Date},
  end_date: {type: Date},
  duration_minutes: {type: Number}, // at end of charge
  latitude: {type: Number},
  longitude: {type: Number},
  odometer: {type: Number},
  battery_range: {type: Number}, // at end of charge
  charge_current_request_max: {type: Number},
  charge_enable_request: {type: Boolean},
  charge_limit_soc: {type: Number},
  charge_limit_soc_max: {type: Number},
  charge_limit_soc_min: {type: Number},
  charge_limit_soc_std: {type: Number},
  charge_miles_added_ideal: {type: Number}, // at end of charge
  charge_miles_added_rated: {type: Number}, // at end of charge
  charge_port_cold_weather_mode: {type: Boolean},
  charge_to_max_range: {type: Boolean},
  charger_phases: {type: Number},
  charger_pilot_current: {type: Number},
  conn_charge_cable: {type: String},
  fast_charger_brand: {type: String},
  fast_charger_present: {type: Boolean},
  fast_charger_type: {type: String},
  managed_charging_active: {type: Boolean},
  managed_charging_start_time: {type: Number},
  managed_charging_user_canceled: {type: Boolean},
  max_range_charge_counter: {type: Number}, // end of charge
  scheduled_charging_pending: {type: Boolean},
  scheduled_charging_start_time: {type: Number},
  trip_charging: {type: Boolean}
});

export default model('ChargeSession', ChargeSessionSchema);

