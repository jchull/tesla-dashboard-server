import {Document, model, Schema} from 'mongoose';

export interface ITeslaAccount extends Document {
  token_created_at?: Date;
  token_expires_in?: number;
  refresh_token?: string;
  access_token?: string;
  email: string;
  // Does not get persisted
  password: string;
}


const TeslaAccountSchema: Schema = new Schema({
  email: {type: String, required: true},
  token_created_at: {type: Date, required: false},
  token_expires_in: {type: Number, required: false},
  refresh_token: {type: String, required: false},
  access_token: {type: String, required: false}
});

export default model('TeslaAccount', TeslaAccountSchema);


