import {Request, Response} from 'express';
import {User, UserType} from '../model';
import {IUser, IUserPreferences, UserRoles} from 'tesla-dashboard-api';
import {BAD_REQUEST, CREATED, NOT_FOUND, OK, UNAUTHORIZED} from 'http-status-codes';
import {ParamsDictionary} from 'express-serve-static-core';
import bcrypt from 'bcrypt';
import {jwt, JWT_COOKIE_PROP} from '../services/JwtService';

const jwtService = jwt();

const paramMissingError = 'Parameter missing';
const loginFailedErr = 'Login failed';

function sanitizeUser(user: IUser): IUser {
  const {username, email, role} = user;
  return {username, email, role};
}

const routes = [
  {
    path: '/user/:username',
    method: 'get',
    handler: async (req: Request, res: Response) => {
      const user = await User.findOne({username: req.params.username}) as UserType;
      if (!user) {
        return res.status(NOT_FOUND)
                  .send();
      }
      res.status(OK)
         .send(sanitizeUser(user));
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
                  .send(sanitizeUser(user));
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
      const x = {} as IUserPreferences;
      res.send('No users');
    }
  },

  {
    path: '/signup',
    method: 'post',
    handler: async (req: Request, res: Response) => {
      try {
        // Check parameters
        const {username, password, email} = req.body;
        if (!username || !password || !email) {
          return res.status(BAD_REQUEST)
                    .json({
                      error: paramMissingError
                    });
        }
        const saltRounds = 10;
        const hash = await bcrypt.hashSync(password, saltRounds);
        const user = await User.create({username, email, pwdHash: hash, role: UserRoles.Standard}) as UserType;
        return res.status(CREATED)
                  .json(sanitizeUser(user));
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
    path: '/login',
    method: 'post',
    handler: async (req: Request, res: Response) => {
      try {
        // Check email and password present
        const {username, password} = req.body;
        if (!(username && password)) {
          return res.status(BAD_REQUEST)
                    .json({
                      error: paramMissingError
                    });
        }
        // Fetch user
        const user = await User.findOne({username}) as UserType;
        if (!user) {
          console.log(`failed login attempt for ${username}!`);
          return res.status(UNAUTHORIZED)
                    .json({
                      error: loginFailedErr
                    });
        }
        // Check password
        // @ts-ignore
        const pwdPassed = bcrypt.compareSync(password, user.pwdHash);
        if (!pwdPassed) {
          console.log(`failed login attempt for ${username}!`);
          return res.status(UNAUTHORIZED)
                    .json({
                      error: loginFailedErr
                    });
        }
        // Setup Cookie
        const token = await jwtService.encode({username, password, subject: 'tesla-dashboard'});
        res.cookie(JWT_COOKIE_PROP, token, jwtService.cookieOptions);
        // Return
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
      console.log('logout');
      return res.status(BAD_REQUEST)
                .json({
                  error: 'Not yet implemented'
                });
    }

  }
];


export default [...routes];
