import jsonwebtoken, {SignOptions, VerifyOptions} from 'jsonwebtoken';
import {CookieOptions, Request} from 'express';

let jwtInstance: JwtService;

export const JWT_COOKIE_PROP = 'jwt';

interface IClientData {
  username: string;
  password: string;
  subject: string;
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
  private readonly serviceOptions: IJwtServiceOptions;
  private readonly signOptions: SignOptions;
  private readonly verifyOptions: VerifyOptions;
  readonly cookieOptions: CookieOptions;


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
      secure: true
    });

    this.serviceOptions = Object.freeze(options);

  }

  encode(data: IClientData): string {
      return jsonwebtoken.sign(data, this.serviceOptions.privateKey, this.signOptions);
  }


  decode(token: string): IClientData {
    return jsonwebtoken.decode(token, {complete: true}) as IClientData;
  }


  verify(token:string) {
    return jsonwebtoken.verify(token, this.serviceOptions.publicKey, this.verifyOptions);

  }
}

