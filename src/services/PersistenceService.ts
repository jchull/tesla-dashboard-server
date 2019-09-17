import {connect} from 'mongoose';
import {Configuration, ConfigurationType} from '../model';

export class PersistenceService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async connect() {
    // Mongoose.Promise = global.Promise;
    connect(this.endpoint, {useNewUrlParser: true})
        .then((mongoose) => {
          // mongoose.on('disconnected', () => {
          //   console.log('Reconnecting to DB...');
          //   this.connect();
          // });
          return console.log(`Successfully connected to DB`);
        })
        .catch(error => {
          console.log('Error connecting to database: ', error);
          return process.exit(1);
        });
  }

  public async getConfiguration(): Promise<ConfigurationType | undefined> {
    // @ts-ignore
    return Configuration.findOne({}) as ConfigurationType;
  }


}

