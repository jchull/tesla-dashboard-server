import {Document, model, Schema} from 'mongoose';

export interface IVehicle extends Document {
  id_s: String;
  vehicle_id: number;
  vin: String;
  display_name: String;
  option_codes: String;
  color?: String;
  //tokens
  // state: String;
  // in_service: boolean;
  calendar_enabled: boolean;
  api_version: number;
  // backseat_token: String
  // backseat_token_updated_at: number
}


const VehicleSchema: Schema = new Schema({
  id_s: {type: String, required: true, unique: true},
  vin: {type: String, required: true},
  display_name: {type: String, required: true},
  color: {type: String, required: false},
  option_codes: {type: String, required: false},
  calendar_enabled: {type: Boolean, required: false},
  api_version: {type: Number, required: false}

});

export default model('Vehicle', VehicleSchema);

