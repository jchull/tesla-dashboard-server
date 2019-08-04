import {Document, model, Schema} from 'mongoose';

export interface IDriveState extends Document {
  id_s: string,
  gps_as_of: Date,
  heading: Number,
  latitude: Number,
  longitude: Number,
  native_latitude: Number,
  native_location_supported: Number,
  native_longitude: Number,
  native_type: String,
  power: Number,
  shift_state: String,
  speed: Number,
  timestamp: Date
}

const DriveStateSchema: Schema = new Schema({
  id_s: {type: String, required: true},
  gps_as_of: {type: Date},
  heading: {type: Number},
  latitude: {type: Number},
  longitude: {type: Number},
  native_latitude: {type: Number},
  native_location_supported: {type: Number},
  native_longitude: {type: Number},
  native_type: {type: String},
  power: {type: Number},
  shift_state: {type: String},
  speed: {type: Number},
  timestamp: {type: Date}


});

export default model('DriveState', DriveStateSchema);

