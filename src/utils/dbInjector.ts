import dbConfig from '../config/knexFile';
import { Knex, knex } from 'knex';

let cachedConnection: Knex;

export const getDb = () => {
    if (cachedConnection != null) {
        console.log("Cached connection");
        return cachedConnection;
    }

    console.log('New connection');
    cachedConnection = knex(dbConfig);
    return cachedConnection;
}