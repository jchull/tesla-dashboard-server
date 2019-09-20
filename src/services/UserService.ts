import {TeslaAccount, TeslaAccountType, User, UserPreferences, UserType} from '../model';
import {ITeslaAccount, IUser, UserRoles} from 'tesla-dashboard-api';
import bcrypt from 'bcrypt';


export class UserService {

  constructor() {
  }

  sanitizeUser(user: IUser): IUser {
    const {username, email, role} = user;
    return {username, email, role};
  }

  sanitizeTeslaAccount(account: ITeslaAccount): ITeslaAccount {
    const {_id, email, refresh_token, access_token, token_created_at, token_expires_in, username} = account;
    return {_id, email, refresh_token, access_token, token_created_at, token_expires_in, username};
  }


  async get(username: string): Promise<IUser | undefined> {
    const user = await User.findOne({username}) as UserType;
    if (user) {
      return this.sanitizeUser(user);
    }
  }

  async create(user: IUser): Promise<IUser> {
    const saltRounds = 10;
    const hash = await bcrypt.hashSync(user.password, saltRounds);
    return await User.create({
      username: user.username,
      email: user.email,
      pwdHash: hash,
      role: UserRoles.Standard
    }) as UserType;
  }

  async update(user: IUser): Promise<IUser> {
    return User.updateOne({username: user.username}, user);
  }

  async delete(username: string): Promise<boolean> {
    const result = await User.deleteOne({username});
    return !!result;
  }

  async checkPassword(username: string, password: string): Promise<boolean> {
    const user = await User.findOne({username}) as UserType;
    return user && user.pwdHash ? bcrypt.compareSync(password, user.pwdHash) : false;
  }

  async getPreferences(username: string) {
    const prefs = await UserPreferences.findOne({username});

  }

  async getTeslaAccounts(username: string) {
    const accountList = await TeslaAccount.find({username})
                                          .populate('sync_preferences') as [TeslaAccountType];
    if (accountList && accountList.length) {
      return accountList.map((account: ITeslaAccount) => this.sanitizeTeslaAccount(account));
    }
  }

  async updateTeslaAccount(account: ITeslaAccount) {
    const {_id} = account;
    let updatedAccount;
    if (_id) {
      const result = await TeslaAccount.updateOne({_id}, account, {password: 'delete'});
      if (result && result.ok === 1) {
        updatedAccount = await TeslaAccount.findOne({_id})
                                           .populate('sync_preferences') as TeslaAccountType;
      }
    } else {
      updatedAccount = await TeslaAccount.create(account) as TeslaAccountType;
    }
    return updatedAccount && this.sanitizeTeslaAccount(updatedAccount);

  }

}

