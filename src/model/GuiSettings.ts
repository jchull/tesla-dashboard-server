import {Document, model, Schema} from 'mongoose';
import {IGuiSettings} from 'tesla-dashboard-api';


const GuiSettingsSchema: Schema = new Schema({
  id_s: {type: String, required: true},
  gui_24_hour_time: {type: Boolean},
  gui_charge_rate_units: {type: String},
  gui_distance_units: {type: String},
  gui_range_display: {type: String},
  gui_temperature_units: {type: String},
  show_range_units: {type: Boolean},
  timestamp: {type: Number}

});

export const GuiSettings = model('GuiSettings', GuiSettingsSchema);
export type GuiSettingsType = IGuiSettings & Document;

