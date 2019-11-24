import {Worker} from 'worker_threads';
import {VehicleService} from './VehicleService';
import {IVehicle} from 'tesla-dashboard-api';

const path = require('path');
const workerPath = path.resolve(__dirname, './SyncWorker.js');

// const work = require(workerPath);

interface WorkerStatus {
  status: string;
  worker: Worker;
}


export class SyncServiceManager {

  private syncServices: Map<String, WorkerStatus>;
  private vs: VehicleService;

  constructor(vs: VehicleService) {
    console.log('Creating new SyncServiceManager');
    this.vs = vs;
    this.syncServices = new Map<String, WorkerStatus>();
  }

  async load() {
    const vehicles = await this.vs.findAll();
    if (vehicles) {
      console.log(`Checking sync status for ${vehicles.length} vehicles`);
      vehicles.forEach(vehicle => {
        console.log('Not enabled for vehicle');
        // if (vehicle.sync_preferences && vehicle.sync_preferences.enabled && vehicle.username) {
        //   const workerData = {username: vehicle.username, id_s: vehicle.id_s};
        //   const worker = new Worker(workerPath, {workerData});
        //   worker.on('message', this.messageHandler(vehicle));
        //   worker.on('online', this.initHandler(vehicle));
        //   worker.on('exit', this.exitHandler(vehicle));
        //   worker.on('error', this.errorHandler(vehicle));
        //
        //   this.syncServices.set(vehicle.id_s, {status: 'UNINITIALIZED', worker});
        //
        // }
      });
    }
  }


  status(id_s: string): string {
    const workerWrapper = this.syncServices.get(id_s);
    if (workerWrapper) {
      return workerWrapper.status;
    } else {
      return 'UNKNOWN';
    }
  }

  private messageHandler(vehicle:IVehicle){
    return (message: any) => {
      console.log(`Vehicle sync for ${vehicle.display_name} sent: ${message}`);

    }
  }

  private initHandler(vehicle: IVehicle) {
    return () => {
      console.log(`Vehicle sync for ${vehicle.display_name} : ${vehicle.id_s} has initialized`);
      this.updateStatus(vehicle.id_s, 'INITIALIZED');
    };
  }

  private exitHandler(vehicle: IVehicle) {
    return () => {
      console.log(`Vehicle sync for ${vehicle.display_name} has exited`);
      if (this.status(vehicle.id_s) !== 'ERRORED') {
        this.updateStatus(vehicle.id_s, 'EXITED');
      }
    };
  }

  private errorHandler(vehicle: IVehicle) {
    return (error: any) => {
      console.log(`Vehicle sync for ${vehicle.display_name} has thrown`, error);
      this.updateStatus(vehicle.id_s, 'ERRORED');
    };
  }

  private updateStatus(id_s: string, status: string) {
    const workerWrapper = this.syncServices.get(id_s);
    if (workerWrapper) {
      workerWrapper.status = status;
    }
  }
}

