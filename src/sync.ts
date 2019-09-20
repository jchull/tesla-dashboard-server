// This is a temporary way to start a polling instance for quick testing


import {PersistenceService} from './services/PersistenceService';
import {DataSyncService} from './services/DataSyncService';
import '../env/';
import {UserService} from './services/UserService';

// TODO: get rid of this
const username = process.argv[2];

const config = Object.assign({}, process.env);
const userService = new UserService();

if (!username) {
  console.error('Username not provided for polling instance!');
  process.exit(1);
}


// @ts-ignore
const db = new PersistenceService(config.DB_CONN);

async function start() {
  await db.connect();
  const config = await PersistenceService.getConfiguration();
  const teslaAccounts = await userService.getTeslaAccounts(username);
  if (teslaAccounts) {
    teslaAccounts.forEach(teslaAccount => {
      const server = new DataSyncService(config, teslaAccount);
      server.beginPolling(60000);
    });
  }
}

start();

