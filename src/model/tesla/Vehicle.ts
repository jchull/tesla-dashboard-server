import {Document, model, Schema} from 'mongoose';

export interface IVehicle extends Document {
  id_s: string;
  vehicle_id: number;
  vin: string;
  display_name: string;
  option_codes: string;
  color?: string;
  //tokens
  // state: string;
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

