import axios from 'axios';
import {TeslaAccount, VehicleType} from '../model';
import {TeslaAccount as ITeslaAccount, VehicleData} from 'tesla-dashboard-api';

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
      // token_expires_in is in seconds, refresh if it expires in the next 24 hours
      if ((Date.now() - 86400000) < this.teslaAccount.token_created_at.valueOf() + (1000 * this.teslaAccount.token_expires_in)) {
        return Promise.resolve();
      } else {
        return this.updateToken('refresh_token');
      }
    } else {
      return this.updateToken('password');
    }
  };

  updateToken(grant_type: string, password?: string) {
    const data = {
      email: this.teslaAccount.email,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type
    };
    if(password && grant_type === 'password'){
      // @ts-ignore
      data[grant_type] = password;
    }else {
      // @ts-ignore
      data[grant_type] = this.teslaAccount[grant_type];
    }
    return axios({
      method: 'post',
      url: `${this.endpoint}/oauth/token?grant_type=${grant_type}`,
      data,
      headers: {
        'User-Agent': 'coderado-tesla-sync'
      }
    })
        .then((res: any) => {
          console.log('Authenticated with Tesla API');
          this.teslaAccount.access_token = res.data.access_token;
          this.teslaAccount.refresh_token = res.data.refresh_token;
          this.teslaAccount.token_expires_in = res.data.expires_in;
          this.teslaAccount.token_created_at = Date.now();
          console.log('saving token');
          return TeslaAccount.updateOne({email: this.teslaAccount.email}, this.teslaAccount);
        })
        .catch((error: any) => {
          console.error(error);
        });
  }


  getVehicles(): Promise<[VehicleType]> {
    return this.checkToken()
               .then(() => axios.get(`${this.endpoint}/api/1/vehicles`, {
                 headers: {
                   'User-Agent': 'coderado-tesla-sync',
                   'Authorization': `Bearer ${this.teslaAccount.access_token}`
                 }
               }))
               .then((vehicleListResponse) => vehicleListResponse?.data?.response);
  }

  getState(id: String): Promise<VehicleData| undefined> {
    return this.checkToken()
               .then(() => axios.get(`${this.endpoint}/api/1/vehicles/${id}/vehicle_data`, {
                 headers: {
                   'User-Agent': 'coderado-tesla-sync',
                   'Authorization': `Bearer ${this.teslaAccount.access_token}`
                 }
               }))
               .then((vehicle_data) => {
                     return vehicle_data?.data?.response;
                   },
                   (err) => {
                     const statusCode = err.response.status;
                     switch (statusCode) {
                       case 408:
                         console.log('Vehicle sleeping');
                         break;
                       case 502:
                         console.log('Vehicle offline');
                         break;
                       case 504:
                         console.log('Vehicle offline');
                         break;
                       default:
                         console.log(`Got response ${statusCode} and it is not handled yet`);
                         console.log(err);
                     }
                   });
  }

  getNearbyChargers(id: String) {
    return this.checkToken()
               .then(() => axios.get(`${this.endpoint}/api/1/vehicles/${id}/nearby_charging_sites`, {
                 headers: {
                   'User-Agent': 'coderado-tesla-sync',
                   'Authorization': `Bearer ${this.teslaAccount.access_token}`
                 }
               }))
               .then((nearby_charging_sites) => {
                     return nearby_charging_sites?.data?.response;
                   },
                   (err) => {
                     const statusCode = err.response.status;
                     switch (statusCode) {
                         // TODO: handle response codes?
                       default:
                         console.log(`Got response ${statusCode} and it is not handled yet`);
                         console.log(err);
                     }
                   });
  }

  async getVehicle(id_s: string) {
    return this.checkToken()
               .then(() => axios.get(`${this.endpoint}/api/1/vehicles/${id_s}`, {
                 headers: {
                   'User-Agent': 'coderado-tesla-sync',
                   'Authorization': `Bearer ${this.teslaAccount.access_token}`
                 }
               }))
               .then((vehicleResponse) => vehicleResponse?.data?.response);
  }
}
