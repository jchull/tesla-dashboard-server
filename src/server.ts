import {ConfigurationType} from './model';
import {createServer} from 'http';
import fs from 'fs';
// @ts-ignore
import express from 'express';
import {jwt} from './services/JwtService';

const envfile = process.argv[2] || './env/.env';
require('dotenv')
    .config({path: envfile});
const config = Object.assign({}, process.env);

const privateKey = fs.readFileSync('./env/private.key', 'utf8');
const publicKey = fs.readFileSync('./env/public.key', 'utf8');

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
