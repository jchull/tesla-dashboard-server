import {Document, model, Schema} from 'mongoose';
import {IChargeState} from './ChargeState';

export interface IChargeSession extends Document {
  id_s: string,
  start_date: Date,
  chargeStates: Array<IChargeState>

}


const ChargeSessionSchema: Schema = new Schema({
  id_s: {type: String, required: true},
  start_date: {type: Date, required: true},
  chargeStates: [{type: Schema.Types.ObjectId, ref: 'ChargeState'}]
});

export default model('ChargeSession', ChargeSessionSchema);

