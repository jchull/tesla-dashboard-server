import {TeslaSyncService} from './TeslaSyncService';
import {SyncPreferences, SyncPreferencesType, Vehicle} from '../model';
import {Worker} from 'worker_threads';
import {PersistenceService} from './PersistenceService';
import {vs} from './index';

export class SyncServiceManager {

  private syncServices:Map<String,Object>;

  constructor() {
    this.syncServices = new Map<String, Object>();
  }

  async init(){
    const vehicles = await vs.findAll();
    if(vehicles){
      vehicles.forEach(vehicle => {
        if(vehicle.sync_preferences && vehicle.sync_preferences.enabled){
          // const tss = new TeslaSyncService()
          // vehicle.sync_preferences.
        }
      })
    }
    // if(syncPrefList){
    //   syncPrefList.forEach(sp => {
    //     console.log(sp._id);
    //     // check syncServices array for
    //     // const child = new Worker();
    //   });
    // }
  }


}

