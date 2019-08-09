import {Document, model, Schema} from 'mongoose';
import {IDriveState} from './DriveState';

export interface IDriveSession extends Document {
  id_s: string,
  start_date: number,
  end_date: number,  // end of trip
  distance?: number,  // end of trip
  tags: [string],
  first: IDriveState,
  last?: IDriveState
}


const DriveSessionSchema: Schema = new Schema({
  id_s: {type: String, required: true},
  start_date: {type: Number, required: true},
  end_date: {type: Number, required: true},
  distance: {type: Number},
  tags: {type: [String]},
  first: {type: Schema.Types.ObjectId, ref: 'DriveState'},
  last: {type: Schema.Types.ObjectId, ref: 'DriveState'}

});

export default model('DriveSession', DriveSessionSchema);

