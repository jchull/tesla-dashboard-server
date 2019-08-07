import {Document, model, Schema} from 'mongoose';

export interface IVehicleConfig extends Document {
  id_s: string,
  can_accept_navigation_requests: boolean,
  can_actuate_trunks: boolean,
  car_special_type: string,
  car_type: string,
  charge_port_type: string,
  eu_vehicle: boolean,
  exterior_color: string,
  has_air_suspension: boolean,
  has_ludicrous_mode: boolean,
  key_version: Number,
  motorized_charge_port: boolean,
  plg: boolean,
  rear_seat_heaters: Number,
  rear_seat_type: string,
  rhd: boolean,
  roof_color: string,
  seat_type: string,
  spoiler_type: string,
  sun_roof_installed: boolean,
  third_row_seats: string,
  timestamp: Date,
  use_range_badging: boolean,
  wheel_type: string
}


const VehicleConfigSchema: Schema = new Schema({
  id_s: {type: String, required: true},
  can_accept_navigation_requests: {type: Boolean},
  can_actuate_trunks: {type: Boolean},
  car_special_type: {type: String},
  car_type: {type: String},
  charge_port_type: {type: String},
  eu_vehicle: {type: Boolean},
  exterior_color: {type: String},
  has_air_suspension: {type: Boolean},
  has_ludicrous_mode: {type: Boolean},
  key_version: {type: Number},
  motorized_charge_port: {type: Boolean},
  plg: {type: Boolean},
  rear_seat_heaters: {type: Number},
  rear_seat_type: {type: String},
  rhd: {type: Boolean},
  roof_color: {type: String},
  seat_type: {type: String},
  spoiler_type: {type: String},
  sun_roof_installed: {type: Boolean},
  third_row_seats: {type: String},
  timestamp: {type: Date},
  use_range_badging: {type: Boolean},
  wheel_type: {type: String}
});

export default model('VehicleConfig', VehicleConfigSchema);

