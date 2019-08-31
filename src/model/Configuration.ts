import {Document, model, Schema} from 'mongoose';
import {IConfiguration} from 'tesla-dashboard-api';

const ConfigurationSchema: Schema = new Schema({
  apiPort: {type: Number, required: true, unique: false},
  ownerBaseUrl: {type: String, required: true, unique: false},
  teslaClientKey: {type: String, required: true, unique: false},
  teslaClientSecret: {type: String, required: true, unique: false}
});

export const Configuration = model('Configuration', ConfigurationSchema);
export type ConfigurationType = IConfiguration & Document;

