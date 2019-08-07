import {Document, model, Schema} from 'mongoose';

export interface ISpeedLimitMode extends Document {
  active: Boolean,
  current_limit_mph: Number,
  max_limit_mph: Number,
  min_limit_mph: Number,
  pin_code_set: Boolean
}


const SpeedLimitModeSchema: Schema = new Schema({
  active: {type: Boolean, required: true},
  current_limit_mph: {type: Number, required: false},
  max_limit_mph: {type: Number, required: false},
  min_limit_mph: {type: Number, required: false},
  pin_code_set: {type: Boolean, required: true}
});

export default model('SpeedLimitMode', SpeedLimitModeSchema);

