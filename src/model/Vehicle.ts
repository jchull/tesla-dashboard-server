import {Document, model, Schema} from 'mongoose';

export interface IVehicle extends Document {
  vehicle_id: number;
  vin: string;
  display_name: string;
  option_codes: string;
  color?: string;
  //tokens
  state: string;
  in_service: boolean;
  id_s: string;
  calendar_enabled: boolean;
  api_version: number;
  //backseat_token
  //backseat_token_updated_at
}


const VehicleSchema: Schema = new Schema({
  id_s: {type: String, required: true, unique: true},
  vin: {type: String, required: true},
  display_name: {type: String, required: true},
  color: {type: String, required: false},
  option_codes: {type: String, required: false},
  state: {type: String, required: false},
  in_service: {type: Boolean, required: false},
  calendar_enabled: {type: Boolean, required: false},
  api_version: {type: Number, required: false}

});

export default model('Vehicle', VehicleSchema);

