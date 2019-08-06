import {Document, model, Schema} from 'mongoose';
import {ITeslaAccount} from './TeslaAccount';
import {IVehicle} from './Vehicle';

export interface IUser extends Document {
  username: String;
  email: String;
  role: String;
  teslaAccounts: Array<ITeslaAccount>;
  vehicles?: Array<IVehicle>;
}


const UserSchema: Schema = new Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  role: {type: String, required: true, unique: false},
  teslaAccounts: [{type: Schema.Types.ObjectId, ref: 'TeslaAccount'}],
  vehicles: [{type: Schema.Types.ObjectId, ref: 'Vehicle'}]

});

export default model('User', UserSchema);


