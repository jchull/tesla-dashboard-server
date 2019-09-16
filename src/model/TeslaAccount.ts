import {Document, model, Schema} from 'mongoose';
import {ITeslaAccount} from 'tesla-dashboard-api';


const TeslaAccountSchema: Schema = new Schema({
  username: {type: String},
  email: {type: String, required: true},
  token_created_at: {type: Number, required: false},
  token_expires_in: {type: Number, required: false},
  refresh_token: {type: String, required: false},
  access_token: {type: String, required: false}
});

export const TeslaAccount = model('TeslaAccount', TeslaAccountSchema);
export type TeslaAccountType = ITeslaAccount & Document;


