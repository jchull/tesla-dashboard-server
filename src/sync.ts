// This is a temporary way to start a polling instance for quick testing

import {IConfiguration} from './model/Configuration';

import {PersistenceService} from './services/PersistenceService';
import {DataSyncService} from './services/DataSyncService';
import User, {IUser} from './model/User';
import TeslaAccount from './model/TeslaAccount';

// TODO: get rid of this
const username = process.argv[2];
const envfile = './config/.env';
require('dotenv')
    .config({path: envfile});
const config = Object.assign({}, process.env);


if (!username) {
  console.error('Username not provided for polling instance!');
  process.exit(1);
}


// @ts-ignore
const db = new PersistenceService(config.DB_CONN);
db.connect()
  .then(() => db.getConfiguration())
  .then((conf: IConfiguration) => {
    TeslaAccount.count({});
    User.findOne({username})
        .populate('teslaAccounts')
        // @ts-ignore
        .then((user: IUser) => {
          user.teslaAccounts.forEach(teslaAccount => {
            const server = new DataSyncService(conf, teslaAccount);
            server.beginPolling(60000);
          });
        });
  });


