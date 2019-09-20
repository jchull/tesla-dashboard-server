import jsonwebtoken, {SignOptions, VerifyOptions} from 'jsonwebtoken';
import {CookieOptions, Request, Response} from 'express';
import {IUser} from 'tesla-dashboard-api';

let jwtInstance: JwtService;

export const JWT_COOKIE_PROP = 'jwt';

interface IClientData {
  username: string;
  role: number | undefined;
  client: string;
}

interface IJwtServiceOptions {
  publicKey: string;
  privateKey: string;
  ttl: number;
}


export const jwt = (options?: IJwtServiceOptions): JwtService => {
  if (jwtInstance) {
    return jwtInstance;
  } else if (options) {
    return jwtInstance = new JwtService(options);
  } else {
    throw Error('options must be provided for creation of JwtService one time');
  }
};

export class JwtService {
  readonly cookieOptions: CookieOptions;
  private readonly serviceOptions: IJwtServiceOptions;
  private readonly signOptions: SignOptions;
  private readonly verifyOptions: VerifyOptions;

  constructor(options: IJwtServiceOptions) {
    this.signOptions = Object.freeze({
      algorithm: 'RS256',
      expiresIn: '12h',
      subject: 'tesla-dashboard'
    });

    this.verifyOptions = Object.freeze({
      algorithm: 'RS256',
      expiresIn: '12h',
      subject: 'tesla-dashboard'
    });

    this.cookieOptions = Object.freeze({
      secure: false,
      httpOnly: false,
      withCredentials: true
    });

    this.serviceOptions = Object.freeze(options);

  }

  encode(data: IClientData): string {
    return jsonwebtoken.sign(data, this.serviceOptions.privateKey, this.signOptions);
  }


  decode(token: string): IClientData | null {
    // @ts-ignore
    const {payload} = jsonwebtoken.decode(token, {complete: true});
    return payload;
  }


  verify(token: string) {
    return jsonwebtoken.verify(token, this.serviceOptions.publicKey, this.verifyOptions);

  }

  cookie(req: Request, res: Response, user: IUser) {
    const token = this.encode({username: user.username, role: user.role, client: req.ip});
    res.cookie(JWT_COOKIE_PROP, token, this.cookieOptions);
  }
}

