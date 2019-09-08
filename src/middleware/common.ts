import express, {Router} from 'express';
import parser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import path from 'path';
import authorized from './auth';


export const handleLogging = (router: Router) =>
    router.use(logger('dev'));

export const handleBodyRequestParsing = (router: Router) => {
  router.use(parser.urlencoded({extended: true}));
  router.use(parser.json());
  router.use(cookieParser(process.env.COOKIE_SECRET));
};

export const handleCompression = (router: Router) => {
  router.use(compression());
};

export const handleStatic = (router: Router) => {
  router.use(express.static(path.resolve('../public')));
};

export const handleAuthentication = (router: Router) => {
  // @ts-ignore
  router.use(authorized());
};


