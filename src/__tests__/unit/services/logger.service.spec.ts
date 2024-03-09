import sinon from 'sinon';
import {LoggerService} from '../../../services';
import {expect} from 'chai';

describe('Logger Service (unit)', () => {
  let loggerService: LoggerService;
  const testSandbox = sinon.createSandbox();

  beforeEach(async () => {
    loggerService = new LoggerService('http-logger-unit-test');
  });

  afterEach(() => {
    testSandbox.restore();
  });

  it('should log message to the console using <logger>', async () => {
    // should use custom logger name
    const response = new LoggerService('http-logger-unit-test');
    expect(response).instanceOf(LoggerService);

    // should use default logger name
    const response2 = new LoggerService();
    expect(response2).instanceOf(LoggerService);
  });

  it('should log using default logger', async () => {
    // should log message using <error>
    loggerService.loggerConfig.error = true;
    loggerService.error('error');

    loggerService.loggerConfig.error = false;
    loggerService.error('error');

    // should log message using <warn>
    loggerService.loggerConfig.warn = true;
    loggerService.warn('warn');

    loggerService.loggerConfig.warn = false;
    loggerService.warn('warn');

    // should log message using <info>
    loggerService.loggerConfig.info = true;
    loggerService.info('info');

    loggerService.loggerConfig.info = false;
    loggerService.info('info');

    // should log message using <debug>
    loggerService.loggerConfig.debug = true;
    loggerService.debug('debug');

    loggerService.loggerConfig.debug = false;
    loggerService.debug('debug');
  });
});
