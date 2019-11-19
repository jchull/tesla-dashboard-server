import {connect, Mongoose} from 'mongoose';
import {Configuration, ConfigurationType} from '../model';


const DEFAULT_CONFIG = {
    "apiPort": 7057,
    "ownerBaseUrl": "https://owner-api.teslamotors.com",
    "teslaClientKey": "81527cff06843c8634fdc09e8ac0abefb46ac849f38fe1e431c2ef2106796384",
    "teslaClientSecret": "c7257eb71a564034f9419ee651c7d0e5f7aa6bfbd18bafb5c5c033b093bb2fa3"
};

export class PersistenceService {
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    public static async getConfiguration(): Promise<ConfigurationType> {
        const config = <ConfigurationType>await Configuration.findOne();
        if (!config) {
            console.log('No app configuration found, installing default...');
            const newConfig = <ConfigurationType>await Configuration.create(DEFAULT_CONFIG);
            return newConfig;
        }
        return config;
    }

    async connect() {
        // @ts-ignore
        Mongoose.Promise = global.Promise;
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

