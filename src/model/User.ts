import {Document, model, Schema} from 'mongoose';
import {IUser} from 'tesla-dashboard-api';

const UserSchema: Schema = new Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  role: {type: String, required: true, unique: false},
  teslaAccounts: [{type: Schema.Types.ObjectId, ref: 'TeslaAccount'}],
  vehicles: [{type: Schema.Types.ObjectId, ref: 'Vehicle'}]

});

export const User = model('User', UserSchema);
export type UserType = IUser & Document;


