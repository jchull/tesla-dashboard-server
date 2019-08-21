import {Document, model, Schema} from 'mongoose';

export interface IVehicle extends Document {
  id_s: string;
  vehicle_id: number;
  vin: string;
  display_name: string;
  option_codes: string;
  color?: string;

  //tokens
  // state: string;
  // in_service: boolean;
  calendar_enabled: boolean;
  api_version: number;
  // backseat_token: String
  // backseat_token_updated_at: number
  odometer?: number;
  timestamp: number;
  car_type: string;
  battery_level: number;
  battery_range: number;
  state: string;
  charging_state?: string;
  time_to_full_charge?: number;
  charge_limit_soc?: number;
  last_session_id: string;
}


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
  last_session_id: {type: String}

});

export default model('Vehicle', VehicleSchema);

