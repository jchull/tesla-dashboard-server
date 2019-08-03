const axios = require('axios');

export class TeslaOwnerService {
  endpoint: string;
  clientId: string;
  clientSecret: string;
  authToken?: string;
  refreshToken?: string;
  expires?: number;

  constructor(endpoint: string, clientId: string, clientSecret: string) {
    this.endpoint = endpoint;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  authenticate(email: string, password: string) {
    if (!(email && password)) {
      throw Error(`You must set auth credentials in the env file`);
    }
    return axios.post(`${this.endpoint}/oauth/token?grant_type=password`, {
                  email,
                  password,
                  client_id: this.clientId,
                  client_secret: this.clientSecret,
                  grant_type: 'password'
                }, {
                  headers: {
                    'User-Agent': 'nodejs'
                  }
                })
                .then((res: any) => {
                  console.log('Authenticated with Tesla API');
                  this.authToken = res.data.access_token;
                  //TODO: use refresh token
                  this.refreshToken = res.data.refresh_token;
                  this.expires = res.data.created_at + res.data.expires_in;
                })
                .catch((error: any) => {
                  console.error(error);
                });
  };


  getVehicles() {
    return axios.get(`${this.endpoint}/api/1/vehicles`, {
      headers: {
        'User-Agent': 'nodejs',
        'Authorization': `Bearer ${this.authToken}`
      }
    });
  }

  getState(id: string) {
    // /api/1/vehicles/{id}/vehicle_data
    console.log(`${this.endpoint}/api/1/vehicles/${id}/vehicle_data`);
    return axios.get(`${this.endpoint}/api/1/vehicles/${id}/vehicle_data`, {
      headers: {
        'User-Agent': 'nodejs',
        'Authorization': `Bearer ${this.authToken}`
      }
    });
  }
};
