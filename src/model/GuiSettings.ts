import {Document, model, Schema} from 'mongoose';

export interface IGuiSettings extends Document {
  id_s: String,
  gui_24_hour_time: Boolean,
  gui_charge_rate_units: String,
  gui_distance_units: String,
  gui_range_display: String,
  gui_temperature_units: String,
  show_range_units: Boolean,
  timestamp: Date
}


const GuiSettingsSchema: Schema = new Schema({
  id_s: {type: String, required: true},
  gui_24_hour_time: {type: Boolean},
  gui_charge_rate_units: {type: String},
  gui_distance_units: {type: String},
  gui_range_display: {type: String},
  gui_temperature_units: {type: String},
  show_range_units: {type: Boolean},
  timestamp: {type: Date}

});

export default model('GuiSettings', GuiSettingsSchema);

