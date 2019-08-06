import TeslaAccount, {ITeslaAccount} from '../model/TeslaAccount';

import axios from 'axios';
import {IVehicle} from '../model/Vehicle';

export class TeslaOwnerService {
  endpoint: string;
  clientId: string;
  clientSecret: string;
  private readonly teslaAccount: ITeslaAccount;

  constructor(endpoint: string, clientId: string, clientSecret: string, teslaAccount: ITeslaAccount) {
    this.endpoint = endpoint;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.teslaAccount = teslaAccount;
  }

  checkToken(): Promise<any> {
    if (this.teslaAccount.access_token && this.teslaAccount.token_expires_in && this.teslaAccount.token_created_at) {
      if (Date.now() < this.teslaAccount.token_created_at.valueOf() + (1000 * this.teslaAccount.token_expires_in)) {
        return Promise.resolve();
      } else {
        return this.updateToken('refresh_token');
      }
    } else {
      return this.updateToken('password');
    }
  };

  updateToken(grant_type: string) {
    const data = {
      email: this.teslaAccount.email,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type
    };
    // @ts-ignore
    data[grant_type] = this.teslaAccount[grant_type];
    return axios({
      method: 'post',
      url: `${this.endpoint}/oauth/token?grant_type=${grant_type}`,
      data,
      headers: {
        'User-Agent': 'tesla-dashboard-sync'
      }
    })
        .then((res: any) => {
          console.log('Authenticated with Tesla API');
          this.teslaAccount.access_token = res.data.access_token;
          this.teslaAccount.refresh_token = res.data.refresh_token;
          this.teslaAccount.token_expires_in = res.data.expires_in;
          this.teslaAccount.token_created_at = new Date();
          console.log('saving token');
          return TeslaAccount.updateOne({_id: this.teslaAccount._id}, this.teslaAccount);
        })
        .catch((error: any) => {
          console.error(error);
        });
  }


  getVehicles(): Promise<Array<IVehicle>> {
    return this.checkToken()
               .then(() => axios.get(`${this.endpoint}/api/1/vehicles`, {
                 headers: {
                   'User-Agent': 'nodejs',
                   'Authorization': `Bearer ${this.teslaAccount.access_token}`
                 }
               }))
               .then((vehicleListResponse) => vehicleListResponse && vehicleListResponse.data && vehicleListResponse.data.response);
  }

  getState(id: String) {
    return this.checkToken()
               .then(() => axios.get(`${this.endpoint}/api/1/vehicles/${id}/vehicle_data`, {
                 headers: {
                   'User-Agent': 'nodejs',
                   'Authorization': `Bearer ${this.teslaAccount.access_token}`
                 }
               }))
               .then((vehicle_data) => {
                     return vehicle_data && vehicle_data.data && vehicle_data.data.response;
                   },
                   (err) => {
                     const statusCode = err.response.status;
                     switch (statusCode) {
                       case 408:
                         console.log('Car sleeping');
                         break;
                       default:
                         console.log(`Got response ${statusCode} and it is not handled yet`);
                     }
                   });
  }
}
