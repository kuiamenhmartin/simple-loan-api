import sinon from 'sinon';
import {RedisClient} from '../../../datasource';
import {Redis, RedisOptions} from 'ioredis';
import EventEmitter from 'events';
import {expect} from 'chai';
import {ServiceUnavailableExceptionError} from '../../../utils';

describe('Redis Datasource (unit)', () => {
  let redisClient: RedisClient;
  let createRedisClientStub: sinon.SinonStub;

  before(async () => {
    createRedisClientStub = sinon.stub(
      RedisClient.prototype,
      'createRedisClient'
    );
    redisClient = new RedisClient();
  });

  afterEach(async () => {
    createRedisClientStub.restore();
  });

  it('should test connect method <connect>', async () => {
    const redisClientEventEmitter = new EventEmitter();
    const errMsg = 'Unable to connect to redis';
    const redisClientOnReadyEvent = sinon.stub().returns(() => {});
    const redisClientErrorEvent = sinon.stub();
    redisClientEventEmitter.on('ready', redisClientOnReadyEvent);
    redisClientEventEmitter.on('error', redisClientErrorEvent);

    createRedisClientStub.returns(redisClientEventEmitter);
    const redisClientInstance = await redisClient.connect();

    // test emit ready state
    redisClientInstance.emit('ready', redisClientOnReadyEvent);

    // expect(redisClientOnReadyEvent.called).to.be.true

    // test trigger error state
    expect(() => redisClientInstance.emit('error', new Error(errMsg))).to.throw(
      ServiceUnavailableExceptionError,
      errMsg
    );
  });

  it('should test create redis client <createRedisClient>', () => {
    // test create redis connection
    const redisOptions = {} as RedisOptions;
    const result = redisClient.createRedisClient(redisOptions);
    expect(result).to.instanceOf(Redis);
  });
});
