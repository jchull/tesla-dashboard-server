import {Document, model, Schema} from 'mongoose';
import {ISpeedLimitMode} from './SpeedLimitMode';

export interface IVehicleState extends Document {
  id_s: string;
  api_version: Number,
  autopark_state_v3: String,
  autopark_style: String,
  calendar_supported: Boolean,
  car_version: String,
  center_display_state: Number,
  df: Number,
  dr: Number,
  ft: Number,
  homelink_nearby: Boolean,
  is_user_present: Boolean,
  last_autopark_error: String,
  locked: Boolean,
  // media_state: { remote_control_enabled: Boolean },
  notifications_supported: Boolean,
  odometer: Number,
  parsed_calendar_supported: Boolean,
  pf: Number,
  pr: Number,
  remote_start: Boolean,
  remote_start_enabled: Boolean,
  remote_start_supported: Boolean,
  rt: Number,
  sentry_mode: Boolean,
  sentry_mode_available: Boolean,
  // software_update: { expected_duration_sec: 2700, status:  },
  speed_limit_mode: ISpeedLimitMode,
  // sun_roof_percent_open: null,
  // sun_roof_state: unknown,
  timestamp: Number,
  valet_mode: Boolean,
  valet_pin_needed: Boolean,
  vehicle_name: String
}


const VehicleStateSchema: Schema = new Schema({
  id_s: {type: String, required: true},
  api_version: {type: Number},
  autopark_state_v3: {type: String},
  autopark_style: {type: String},
  calendar_supported: {type: Boolean},
  car_version: {type: String},
  center_display_state: {type: Number},
  df: {type: Number},
  dr: {type: Number},
  ft: {type: Number},
  homelink_nearby: {type: Boolean},
  is_user_present: {type: Boolean},
  last_autopark_error: {type: String},
  locked: {type: Boolean},
  notifications_supported: {type: Boolean},
  odometer: {type: Number},
  parsed_calendar_supported: {type: Boolean},
  pf: {type: Number},
  pr: {type: Number},
  remote_start: {type: Boolean},
  remote_start_enabled: {type: Boolean},
  remote_start_supported: {type: Boolean},
  rt: {type: Number},
  sentry_mode: {type: Boolean},
  sentry_mode_available: {type: Boolean},
  speed_limit_mode: {type: Schema.Types.ObjectId, ref: 'SpeedLimitMode'},
  timestamp: {type: Number},
  valet_mode: {type: Boolean},
  valet_pin_needed: {type: Boolean},
  vehicle_name: {type: String}

  });

export default model('VehicleState', VehicleStateSchema);
