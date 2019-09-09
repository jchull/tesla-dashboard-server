import {ConfigurationType} from './model';
import {createServer} from 'http';
import fs from 'fs';
import express from 'express';
import {jwt} from './services/JwtService';

import '../env/';
const config = Object.assign({}, process.env);

const privateKey = fs.readFileSync('./env/key.pem', 'utf8');
const publicKey = fs.readFileSync('./env/key.pub', 'utf8');

jwt({publicKey, privateKey, ttl: 1000 * 60 * 60 * 24});



import {applyMiddleware, applyRoutes} from './util';
import routes from './routes';
import middleware from './middleware';
import {PersistenceService} from './services/PersistenceService';

const router = express();
applyMiddleware(middleware, router);
// @ts-ignore
applyRoutes(routes, router);


// @ts-ignore
const db = new PersistenceService(config.DB_CONN);
db.connect()
  .then(() => db.getConfiguration())
  .then((conf: ConfigurationType) => {
    const server = createServer(router);
    server.listen(conf.apiPort, () =>
        console.log(`Server is running at http://localhost:${conf.apiPort} ...`));
    return server;
  });
