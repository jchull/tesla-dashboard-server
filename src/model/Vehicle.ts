import {Document, model, Schema} from 'mongoose';
import {IVehicle} from 'tesla-dashboard-api';


const VehicleSchema: Schema = new Schema({
  id_s: {type: String, required: true, unique: true},
  vin: {type: String, required: true},
  display_name: {type: String, required: true},
  color: {type: String, required: false},
  option_codes: {type: String, required: false},
  calendar_enabled: {type: Boolean, required: false},
  api_version: {type: Number, required: false},
  odometer: {type: Number, required: false},
  timestamp: {type: Number, required: false},
  car_type: {type: String, required: false},
  battery_level: {type: Number},
  state: {type: String},
  battery_range: {type: Number},
  charging_state: {type: String},
  time_to_full_charge: {type: Number},
  charge_limit_soc: {type: Number},
  charge_limit_soc_min: {type: Number},
  last_session_id: {type: String},
  username: {type: String},
  sync_preferences: {type: Schema.Types.ObjectId, ref: 'SyncPreferences'},
  sync_state: {type: String}
});

export const Vehicle = model('Vehicle', VehicleSchema);
export type VehicleType = IVehicle & Document;

