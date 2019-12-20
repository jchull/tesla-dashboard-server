import {createServer} from 'http';
import express from 'express';
import {services} from './services';
import {applyMiddleware, applyRoutes} from './util';
import {getRoutes} from './routes';
import middleware from './middleware';
import {PersistenceService} from './services/PersistenceService';

const router = express();
applyMiddleware(middleware, router);
applyRoutes(getRoutes(services), router);


PersistenceService.getConfiguration()
    .then(conf => {
        const server = createServer(router);
        server.listen(conf.apiPort, () =>
            console.log(`API is running on port ${conf.apiPort}`));

        // load sync services which will start up workers for any configured sync instances
        services.ssm.load();
    });

