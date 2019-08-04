import {Document, model, Schema} from 'mongoose';

export interface ITeslaAccount extends Document {
  token_created_at?: Date;
  token_expires_in?: number;
  refresh_token?: string;
  access_token?: string;
  email: string;
  // TODO: this should be removed and tokens used exclusively
  password: string;
}


const TeslaAccountSchema: Schema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},// TODO: remove me
  token_created_at: {type: Date, required: false},
  token_expires_in: {type: Number, required: false},
  refresh_token: {type: String, required: false},
  access_token: {type: String, required: false}
});

export default model('TeslaAccount', TeslaAccountSchema);


