import { expect, use, should } from 'chai';
import chaiHttp from 'chai-http';
import { promisify } from 'util';
const Redis = require('ioredis');
import redisClient from '../utils/redis';

use(chaiHttp);
should();
jest.mock('ioredis');

describe('Redis Client Tests', () => {
  before(async () => {
    await redisClient.client.flushall('ASYNC');
  });

  after(async () => {
    await redisClient.client.flushall('ASYNC');
  });

  it('should create a new Redis client', () => {
    const mockRedisClient = jest.fn();
    Redis.mockImplementationOnce(() => ({
      on: mockRedisClient,
    }));

    getRedisClient();

    expect(Redis).toHaveBeenCalledTimes(1);
    expect(mockRedisClient).toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('shows that connection is alive', async() => {
    expect(redisClient.isAlive()).to.equal(true);
  });

  it('returns key as null when it does not exist', async() => {
    expect(await redisClient.get('myKey')).to.equal(null);
  });

  it('set key can be called without issue', async() => {
    expect(await redisClient.set('myKey', 2, 3)).to.equal(undefined);
  });

  it('returns key with null upon expiry', async() => {
    const sleep = promisify(setTimeout);
    await sleep(1100);
    expect(await redisClient.get('myKey')).to.equal(null);
  });
});
