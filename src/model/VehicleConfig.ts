import {Document, model, Schema} from 'mongoose';

export interface IVehicleConfig extends Document {
  id_s: String,
  can_accept_navigation_requests: Boolean,
  can_actuate_trunks: Boolean,
  car_special_type: String,
  car_type: String,
  charge_port_type: String,
  eu_vehicle: Boolean,
  exterior_color: String,
  has_air_suspension: Boolean,
  has_ludicrous_mode: Boolean,
  key_version: Number,
  motorized_charge_port: Boolean,
  plg: Boolean,
  rear_seat_heaters: Number,
  rear_seat_type: String,
  rhd: Boolean,
  roof_color: String,
  seat_type: String,
  spoiler_type: String,
  sun_roof_installed: Boolean,
  third_row_seats: String,
  timestamp: Date,
  use_range_badging: Boolean,
  wheel_type: String
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

