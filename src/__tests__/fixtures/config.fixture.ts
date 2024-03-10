import * as dotenv from 'dotenv';
import {Redis} from '../../constants';
import path from 'path';

// Loads config file dynamically
dotenv.config({path: path.join(__dirname, './.env.test'), override: true});

const {env} = process;

export const TestConfig = {
  PORT: 3010,
  REDIS: {
    host: env.REDIS_HOST || Redis.DEFAULT_HOST,
    port: Number(env.REDIS_PORT || Redis.DEFAULT_PORT),
    password: env.REDIS_PASSWORD || '',
    username: env.REDIS_USERNAME || '',
    db: env.REDIS_DB || 0,
  },
};
