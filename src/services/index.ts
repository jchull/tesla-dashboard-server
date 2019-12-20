import {PersistenceService} from './PersistenceService';
import {UserService} from './UserService';
import fs from 'fs';

import {VehicleService} from './VehicleService';
import {SyncServiceManager} from './SyncServiceManager';
import {jwt} from './JwtService';
import { Configuration } from 'tesla-dashboard-api';

const envConfig = Object.assign({}, process.env);

const privateKey = fs.readFileSync('./env/key.pem', 'utf8');
const publicKey = fs.readFileSync('./env/key.pub', 'utf8');

jwt({publicKey, privateKey, ttl: 1000 * 60 * 60 * 24});

if(!envConfig.DB_CONN){
  console.error("---> DB_CONN not set!!!");
}


// @ts-ignore
const db = new PersistenceService(envConfig.DB_CONN);
db.connect();
let appConfig: Configuration;
PersistenceService.getConfiguration()
    .then(conf => {
      appConfig = conf;
    });


const vs = new VehicleService();
const userService = new UserService();
const ssm = new SyncServiceManager(vs);

export const services = { db, vs, ssm, jwt, userService, envConfig};
export type ServicesType = typeof services;

