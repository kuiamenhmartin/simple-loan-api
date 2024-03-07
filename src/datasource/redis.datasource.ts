import Redis, { RedisOptions } from 'ioredis';
import {Config} from '../config';
import { LoggerName } from '../constants';
import {LoggerService} from '../services';
import { HttpErrors } from '../utils';

let redisClient: Redis;

/**
 * Create a singleton redis connection
 * @return Promise<Redis>
 * @see https://github.com/redis/ioredis
 */
export class RedisClient {
  logger: LoggerService;
  config: Config;

  constructor() {
    this.logger = new LoggerService(LoggerName.DB_CONNECTION);
    this.config = new Config();
  }

  async connect(): Promise<Redis> {
    if (!redisClient) {
      try {
          this.logger.info('creating redis connection...');
          const conn = new Redis({
              port: this.config.redis.port,
              host: this.config.redis.host,
              password: this.config.redis.password,
              username: this.config.redis.username,
              db: Number(this.config.redis.db)
          } as RedisOptions);
          // set redis connection  once created
          redisClient = conn;
      } catch(err) {
        this.logger.error(err);
          throw HttpErrors.ServiceUnavailable((err as Error).message);
      }
    }
    this.logger.info(`connected to redis client on port ${this.config.redis.port}`);
    return redisClient;
  }
}
