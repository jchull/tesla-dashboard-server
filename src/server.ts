import {createServer} from 'http';
import express from 'express';
import {ssm} from './services';
import {applyMiddleware, applyRoutes} from './util';
import routes from './routes';
import middleware from './middleware';
import {PersistenceService} from './services/PersistenceService';

const router = express();
applyMiddleware(middleware, router);
applyRoutes(routes, router);


PersistenceService.getConfiguration()
    .then(conf => {
      const server = createServer(router);
      server.listen(conf.apiPort, () =>
          console.log(`Server is running at http://localhost:${conf.apiPort} ...`));
      ssm.init();
    });


