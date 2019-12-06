import {TeslaAccount, TeslaAccountType, User, UserPreferences, UserType} from '../model';
import {TeslaAccount as ITeslaAccount, User as IUser, UserRoles} from 'tesla-dashboard-api';
import {VehicleService} from './VehicleService';

const { isMainThread } = require("worker_threads");

let bcrypt:any;
if (isMainThread) bcrypt = require("bcrypt");
const vs = new VehicleService();


export class UserService {

  constructor() {
  }

  sanitizeUser(user: UserType): IUser {
    const {username, email, role} = user;
    return {username, email, role};
  }

  sanitizeTeslaAccount(account: TeslaAccountType): ITeslaAccount {
    const {_id, email, refresh_token, access_token, token_created_at, token_expires_in, username} = account;
    return {_id, email, refresh_token, access_token, token_created_at, token_expires_in, username};
  }


  async get(username: string): Promise<IUser | undefined> {
    const user = await User.findOne({username});
    if (user) {
      return this.sanitizeUser(user);
    }
  }

  async create(user: IUser): Promise<IUser> {
    if(!bcrypt){
      throw Error("Cannot run bcrypt in worker!");
    }
    const saltRounds = 10;
    const hash = await bcrypt.hashSync(user.password, saltRounds);
    return await User.create({
      username: user.username,
      email: user.email,
      pwdHash: hash,
      role: UserRoles.Standard
    });
  }

  async update(user: IUser): Promise<IUser> {
    return User.updateOne({username: user.username}, user);
  }

  async delete(username: string): Promise<boolean> {
    const result = await User.deleteOne({username});
    return !!result;
  }

  async checkPassword(username: string, password: string): Promise<boolean> {
    const user = await User.findOne({username});
    return user?.pwdHash ? bcrypt.compareSync(password, user.pwdHash) : false;
  }

  async getPreferences(username: string) {
    const prefs = await UserPreferences.findOne({username});

  }

  async getTeslaAccounts(username: string, vehicleId?: string): Promise<ITeslaAccount[]| undefined> {
    const accountList = await TeslaAccount.find({username});
    if (accountList?.length) {
      if (vehicleId) {
        const vehicle = await vs.get(vehicleId);
        if (vehicle?.sync_preferences) {
          const {accountId} = vehicle.sync_preferences;
          return accountList.filter(account => accountId === account._id)
                            .map((account: TeslaAccountType) => this.sanitizeTeslaAccount(account));

        }
      }
      return accountList.map((account: TeslaAccountType) => this.sanitizeTeslaAccount(account));
    }
  }

  async updateTeslaAccount(account: ITeslaAccount) {
    const {_id} = account;
    let updatedAccount;
    if (_id) {
      const result = await TeslaAccount.updateOne({_id}, account, {password: 'delete'});
      if (result?.ok === 1) {
        updatedAccount = await TeslaAccount.findOne({_id});
      }
    } else {
      updatedAccount = await TeslaAccount.create(account);
    }
    return updatedAccount && this.sanitizeTeslaAccount(updatedAccount);

  }

}

