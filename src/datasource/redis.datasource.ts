import Redis, {RedisOptions} from 'ioredis';
import {Config} from '../config';
import {LoggerName} from '../constants';
import {LoggerService} from '../services';
import {ServiceUnavailableExceptionError} from '../utils';

let dSource: Redis;

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

  createRedisClient(opts: RedisOptions): Redis {
    return new Redis(opts);
  }

  async connect(): Promise<Redis> {
    if (!dSource) {
      this.logger.info('creating redis connection...');
      const conn = this.createRedisClient({
        port: this.config.redis.port,
        host: this.config.redis.host,
        password: this.config.redis.password,
        username: this.config.redis.username,
        db: Number(this.config.redis.db),
      });
      // set redis connection  once created
      dSource = conn;
    }

    // redis listeners to react to state changes
    dSource.on('ready', () => {
      this.logger.info(
        `connected to redis client on port ${this.config.redis.port}`
      );
    });

    dSource.on('error', err => {
      this.logger.error(err.message);
      throw new ServiceUnavailableExceptionError(err.message);
    });

    // return redis client connection
    return dSource;
  }
}
