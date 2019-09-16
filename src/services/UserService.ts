import {User, UserType} from '../model';
import {IUser, UserRoles, ITeslaAccount} from 'tesla-dashboard-api';
import bcrypt from 'bcrypt';
import {UserPreferences} from '../model/UserPreferences';


export class UserService {

  constructor() {
  }

  sanitizeUser(user: IUser): IUser {
    const {username, email, role} = user;
    return {username, email, role};
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

  async getPreferences(username: string){
    const prefs = await UserPreferences.findOne({username})

  }

  async getTeslaAccounts(username: string){

  }

  async updateTeslaAccount(account: ITeslaAccount){
    //handle update or create
  }

}

