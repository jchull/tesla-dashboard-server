import {Document, model, Schema} from 'mongoose';
import {ISyncPreferences} from 'tesla-dashboard-api';


const SyncPreferencesSchema: Schema = new Schema({
  enabled: {type: Boolean},
  driving_pollingIntervalsSeconds: {type: Number},
  driving_minDurationMinutes: {type: Number},
  charging_minDurationMinutes: {type: Number},
  charging_costPerKwhHome: {type: Number},
  charging_costPerKwhSupercharging: {type: Number},
  charging_pollingIntervalsSeconds: {type: [Number, Number, Number]}
});

export const SyncPreferences = model('SyncPreferences', SyncPreferencesSchema);
export type SyncPreferencesType = ISyncPreferences & Document;


