import {connect} from 'mongoose';
import {Configuration, ConfigurationType} from '../model';

export class PersistenceService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public static async getConfiguration(): Promise<ConfigurationType> {
    const config = <ConfigurationType>await Configuration.findOne();
    if (!config) {
      throw Error('No app configuration found!');
    }
    return config;
  }

  async connect() {
    // Mongoose.Promise = global.Promise;
    connect(this.endpoint, {useNewUrlParser: true})
        .then((mongoose) => {
          // mongoose.on('disconnected', () => {
          //   console.log('Reconnecting to DB...');
          //   this.connect();
          // });
          return;
        })
        .catch(error => {
          console.log('Error connecting to database: ', error);
          return process.exit(1);
        });
  }


}

