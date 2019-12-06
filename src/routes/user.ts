import {Request, Response} from 'express';
import {User} from '../model';
import {UserPreferences} from 'tesla-dashboard-api';
import {BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNAUTHORIZED} from 'http-status-codes';
import {ParamsDictionary} from 'express-serve-static-core';
import {JWT_COOKIE_PROP} from '../services/JwtService';
import {Route} from '../util';



const paramMissingError = 'Parameter missing';
const loginFailedErr = 'Login failed';


export function getUserRoutes(services: any): Route[] {
  const jwtService = services.jwt();

  return [
    {
      path: '/user/:username',
      method: 'get',
      handler: async (req: Request, res: Response) => {
        const username = req.params.username;
        if (!username) {
          return res.status(BAD_REQUEST)
                    .json({
                      error: paramMissingError,
                      message: 'Missing username URL Parameter'
                    });
        }
        if (!username) { // TODO: check against header username set by auth on response?
          return res.status(UNAUTHORIZED)
                    .end();
        }
        const user = await services.userService.get(username);
        return user ? res.status(OK)
                         .json(user) :
            res.status(NOT_FOUND)
               .end();
      }
    },
    {
      path: '/user',
      method: 'put',
      handler: async (req: Request, res: Response) => {
        try {
          // Check Parameters
          const {user} = req.body;
          if (!user) {
            return res.status(BAD_REQUEST)
                      .json({
                        error: paramMissingError
                      });
          }
          // Update user
          user.id = Number(user.id);
          await User.updateOne({id: user.id}, user);
          return res.status(OK)
                    .send(user);
        } catch (err) {
          console.log(err.message, err);
          return res.status(BAD_REQUEST)
                    .json({
                      error: err.message
                    });
        }
      }
    },
    {
      path: '/user',
      method: 'delete',
      handler: async (req: Request, res: Response) => {
        try {
          const {id} = req.params as ParamsDictionary;
          await User.deleteOne({id: Number(id)});
          return res.status(OK)
                    .end();
        } catch (err) {
          console.log(err.message, err);
          return res.status(BAD_REQUEST)
                    .json({
                      error: err.message
                    });
        }
      }
    },
    {
      path: '/user/:username/prefs',
      method: 'get',
      handler: async (req: Request, res: Response) => {
        const x = {} as UserPreferences;
        res.send('No users');
      }
    },

    {
      path: '/user/:username/tesla-account',
      method: 'get',
      handler: async (req: Request, res: Response) => {
        const {username} = req.params;
        const accounts = await services.userService.getTeslaAccounts(username);
        if (accounts) {
          return res.status(OK)
                    .json(accounts);
        }
        return res.status(NOT_FOUND)
                  .send();
      }
    },
    {
      path: '/user/:username/tesla-account/:_id',
      method: 'put',
      handler: async (req: Request, res: Response) => {
        try {
          // Check Parameters
          const account = req.body;
          const {_id} = req.params;
          // TODO: req.params._id should match account._id
          if (!account) {
            return res.status(BAD_REQUEST)
                      .json({
                        error: paramMissingError
                      });
          }
          const result = await services.userService.updateTeslaAccount(account);
          if (result) {
            return res.status(OK)
                      .json(result);
          } else {
            return res.status(INTERNAL_SERVER_ERROR)
                      .json({
                        message: 'Could not update Tesla Account info'
                      });
          }
          // TODO: do products query when new account is added, if account cannot connect, keep status
        } catch (err) {
          return res.status(BAD_REQUEST)
                    .json({
                      error: err.message
                    });
        }
      }
    },

    {
      path: '/signup',
      method: 'post',
      handler: async (req: Request, res: Response) => {
        try {
          const {username, password, email} = req.body;
          if (!username || !password || !email) {
            return res.status(BAD_REQUEST)
                      .json({
                        error: paramMissingError
                      });
          }
          const user = await services.userService.create({username, email, password});
          return res.status(CREATED)
                    .json(user);
        } catch (err) {
          return res.status(BAD_REQUEST)
                    .json({
                      error: err.message
                    });
        }
      }
    },
    {
      path: '/login',
      method: 'post',
      handler: async (req: Request, res: Response) => {
        try {
          const {username, password} = req.body;
          if (!(username && password)) {
            return res.status(BAD_REQUEST)
                      .json({
                        error: paramMissingError
                      });
          }
          const user = await services.userService.get(username);
          if (!user) {
            console.log(`failed login attempt for ${username}!`);
            return res.status(UNAUTHORIZED)
                      .json({
                        error: loginFailedErr
                      });
          }
          const pwdPassed = services.userService.checkPassword(username, password);
          if (!pwdPassed) {
            console.log(`failed login attempt for ${username}!`);
            return res.status(UNAUTHORIZED)
                      .json({
                        error: loginFailedErr
                      });
          }
          jwtService.cookie(req, res, user);
          return res.status(OK)
                    .end();
        } catch (err) {
          console.log(err.message, err);
          return res.status(BAD_REQUEST)
                    .json({
                      error: err.message
                    });
        }
      }
    },
    {
      path: '/logout',
      method: 'get',
      handler: async (req: Request, res: Response) => {
        res.clearCookie(JWT_COOKIE_PROP, jwtService.cookieOptions);
        return res.status(OK)
                  .end();
      }

    }
  ] as Route[];


}
