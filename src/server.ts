import http from 'http';
import express from 'express';
import {applyMiddleware, applyRoutes} from './util';
import routes from './routes';
import middleware from './middleware';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import cors from 'cors';

const router = express();
applyMiddleware(middleware, router);
// @ts-ignore
applyRoutes(routes, router);
const {PORT = 3001} = process.env;
const server = http.createServer(router);

server.listen(PORT, () =>
    console.log(`Server is running at http://localhost:${PORT} ...`)
);

router.use(logger('dev'));
router.use(express.json());
router.use(express.urlencoded({extended: false}));
router.use(cookieParser());
router.use(cors({
  origin: 'http://localhost:3000' // TODO: get from configuration
}));




