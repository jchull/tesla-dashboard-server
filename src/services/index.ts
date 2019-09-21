import {PersistenceService} from './PersistenceService';
import {UserService} from './UserService';
import fs from 'fs';

import '../../env/';
import {VehicleService} from './VehicleService';
import {SyncServiceManager} from './SyncServiceManager';
import {jwt} from './JwtService';

const config = Object.assign({}, process.env);

const privateKey = fs.readFileSync('./env/key.pem', 'utf8');
const publicKey = fs.readFileSync('./env/key.pub', 'utf8');

jwt({publicKey, privateKey, ttl: 1000 * 60 * 60 * 24});


// @ts-ignore
const db = new PersistenceService(config.DB_CONN);
db.connect();

const vs = new VehicleService();
const userService = new UserService();
const ssm = new SyncServiceManager();

export {db, vs, ssm, jwt, userService};
