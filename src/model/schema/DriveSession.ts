import {model, Schema} from 'mongoose';

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

