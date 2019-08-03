import {model, Document, Schema} from 'mongoose';

export interface ITeslaAccount extends Document {
  email: string;
  password: string;
}


const TeslaAccountSchema: Schema = new Schema({
  email: {type: String, required: true, unique: false},
  password: {type: String, required: true, unique: false}
});

export default model('TeslaAccount', TeslaAccountSchema);


