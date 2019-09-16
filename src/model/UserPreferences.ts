import {Document, model, Schema} from 'mongoose';
import {IUserPreferences} from 'tesla-dashboard-api';


const UserPreferencesSchema: Schema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  display_distanceUnits: {type: String},
  display_currencyCode: {type: String},
  display_tempUnits: {type: String},
  driving_pollingIntervalsSeconds: {type: Number},
  driving_minDurationMinutes: {type: Number},
  charging_minDurationMinutes: {type: Number},
  charging_costPerKwhHome: {type: Number},
  charging_costPerKwhSupercharging: {type: Number},
  charging_pollingIntervalsSeconds: {type: [Number, Number, Number]}
});

export const UserPreferences = model('UserPreferences', UserPreferencesSchema);
export type UserPreferencesType = IUserPreferences & Document;


