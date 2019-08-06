import {Document, model, Schema} from 'mongoose';

export interface IDriveSession extends Document {
  id_s: String,
  start_date: Date,
  end_date: Date,  // end of trip
  distance: number,  // end of trip
  odometer: number // end of trip
}


const DriveSessionSchema: Schema = new Schema({
  id_s: {type: String, required: true},
  start_date: {type: Date, required: true},
  end_date: {type: Date},
  distance: {type: Number},
  odometer: {type: Number}

});

export default model('DriveSession', DriveSessionSchema);

