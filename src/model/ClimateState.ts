import {Document, model, Schema} from 'mongoose';

export interface IClimateState extends Document {
  battery_heater: Boolean,
  // battery_heater_no_power: null,
  climate_keeper_mode: String,
  driver_temp_setting: Number,
  fan_status: Number,
  inside_temp: Number,
  is_auto_conditioning_on: Boolean,
  is_climate_on: Boolean,
  is_front_defroster_on: Boolean,
  is_preconditioning: Boolean,
  is_rear_defroster_on: Boolean,
  left_temp_direction: Number,
  max_avail_temp: Number,
  min_avail_temp: Number,
  outside_temp: Number,
  passenger_temp_setting: Number,
  remote_heater_control_enabled: Boolean,
  right_temp_direction: Number,
  seat_heater_left: Number,
  seat_heater_rear_center: Number,
  seat_heater_rear_left: Number,
  seat_heater_rear_right: Number,
  seat_heater_right: Number,
  side_mirror_heaters: Boolean,
  smart_preconditioning: Boolean,
  timestamp: Date,
  wiper_blade_heater: Boolean
}


const ClimateStateSchema: Schema = new Schema({
  battery_heater: {type: Boolean},
  // battery_heater_no_power: {type: null},
  climate_keeper_mode: {type: String},
  driver_temp_setting: {type: Number},
  fan_status: {type: Number},
  inside_temp: {type: Number},
  is_auto_conditioning_on: {type: Boolean},
  is_climate_on: {type: Boolean},
  is_front_defroster_on: {type: Boolean},
  is_preconditioning: {type: Boolean},
  is_rear_defroster_on: {type: Boolean},
  left_temp_direction: {type: Number},
  max_avail_temp: {type: Number},
  min_avail_temp: {type: Number},
  outside_temp: {type: Number},
  passenger_temp_setting: {type: Number},
  remote_heater_control_enabled: {type: Boolean},
  right_temp_direction: {type: Number},
  seat_heater_left: {type: Number},
  seat_heater_rear_center: {type: Number},
  seat_heater_rear_left: {type: Number},
  seat_heater_rear_right: {type: Number},
  seat_heater_right: {type: Number},
  side_mirror_heaters: {type: Boolean},
  smart_preconditioning: {type: Boolean},
  timestamp: {type: Date},
  wiper_blade_heater: {type: Boolean}
});

export default model('ClimateState', ClimateStateSchema);

