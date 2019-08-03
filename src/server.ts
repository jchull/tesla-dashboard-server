import {IConfiguration} from './model/Configuration';
import {createServer} from 'http';
// @ts-ignore
import express from 'express';
import {applyMiddleware, applyRoutes} from './util';
import routes from './routes';
import middleware from './middleware';
import {PersistenceService} from './services/PersistenceService';

const envfile = process.argv[2] || './config/.env';
require('dotenv')
    .config({path: envfile});
const config = Object.assign({}, process.env);


const router = express();
applyMiddleware(middleware, router);
// @ts-ignore
applyRoutes(routes, router);


// @ts-ignore
const db = new PersistenceService(config.DB_CONN);
db.connect()
  .then(() => db.getConfiguration())
  .then((conf: IConfiguration) => {
    const server = createServer(router);
    server.listen(conf.apiPort, () =>
        console.log(`Server is running at http://localhost:${conf.apiPort} ...`));
    return server;
  });


