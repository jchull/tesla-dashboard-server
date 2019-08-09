import {Document, model, Schema} from 'mongoose';

export interface IGuiSettings extends Document {
  id_s: string,
  gui_24_hour_time: boolean,
  gui_charge_rate_units: string,
  gui_distance_units: string,
  gui_range_display: string,
  gui_temperature_units: string,
  show_range_units: boolean,
  timestamp: number
}


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

export default model('GuiSettings', GuiSettingsSchema);

