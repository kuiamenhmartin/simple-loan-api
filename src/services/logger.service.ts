import {addColors, createLogger, format, transports} from 'winston';
import * as dotenv from 'dotenv';
import {AnyData} from '../types';
import {safeJsonParse} from '../utils/safe-json-parse.util';
import {Environment, LOGGER_SERVICE} from '../constants';

dotenv.config();
const {env} = process;

/**
 * LoggerService - service for logging logs based on level
 */
export class LoggerService {
  private logger;

  loggerConfig = {
    env: env.NODE_ENV || Environment.DEV,
    serviceName: env.LOGGER_SERVICE || LOGGER_SERVICE,
    info: safeJsonParse(env.LOG_ENABLE_INFO, true),
    warn: safeJsonParse(env.LOG_ENABLE_WARN, true),
    debug: safeJsonParse(env.LOG_ENABLE_DEBUG, true),
    verbose: safeJsonParse(env.LOG_ENABLE_VERBOSE, true),
    error: safeJsonParse(env.LOG_ENABLE_ERROR, true),
  };

  private serviceName = `${this.loggerConfig.serviceName}-${this.loggerConfig.env}-api`;

  constructor(name = LOGGER_SERVICE) {
    const customFormat = format.combine(
      format.colorize({all: true}),
      format.label({label: `${this.serviceName}:${name}`}),
      format.timestamp({format: 'isoDateTime'}),
      format.printf(
        (info: AnyData) =>
          `[${info.timestamp}] ${info.level} ${info.label} - ${info.message}`
      )
    );

    addColors({
      info: 'bold blue',
      warn: 'italic yellow',
      error: 'bold red',
      debug: 'green',
    });

    const transportList = [];
    transportList.push(
      new transports.Console({format: format.combine(customFormat)})
    );

    this.logger = createLogger({
      level: 'debug',
      exitOnError: false,
      format: format.json(),
      transports: transportList,
    });
  }

  warn(msg: AnyData) {
    if (this.loggerConfig.warn) {
      this.logger.warn(msg);
    }
  }

  debug(msg: AnyData) {
    if (this.loggerConfig.debug) {
      this.logger.debug(msg);
    }
  }

  error(msg: AnyData) {
    if (this.loggerConfig.error) {
      this.logger.error(msg);
    }
  }

  info(msg: AnyData) {
    if (this.loggerConfig.info) {
      this.logger.info(msg);
    }
  }
}
