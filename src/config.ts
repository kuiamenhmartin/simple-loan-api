import * as dotenv from 'dotenv';
import { DEFAULT_PORT, Environment, Redis } from './constants';
import path from 'path';

const environment = process.env.NODE_ENV || '';
dotenv.config({ 
  path: path.resolve(`./.env${environment ? `.${environment}` : `` }`).normalize(),
  override: true
});

const {env} = process;

/**
 * Config - the class that contains the basic configurations for the application.
 * This also contains the variable values loaded from .env file
 */
export class Config {
  /**
   * Current Environment
   */
  env = env.NODE_ENV || Environment.DEV;

  /**
   * Current Port
   */
  port = env.PORT || DEFAULT_PORT;

  /**
   * Redis config
   */
  redis = {
    host: env.REDIS_HOST || Redis.DEFAULT_HOST,
    port: Number(env.REDIS_PORT || Redis.DEFAULT_PORT),
    password: env.REDIS_PASSWORD || '',
    username: env.REDIS_USERNAME || '',
    db: env.REDIS_DB || 0
  }
}