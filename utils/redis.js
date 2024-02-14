const redis = require('redis');

class RedisClient {
  constructor(options) {
    this.client = redis.createClient(options);

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
   });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
	  reject(err);
	} else {
	  resolve(reply);
	}
      });
    });
  }

  async set(key, value, duration) {
    await new Promise((resolve, reject) => {
      this.client.set(key, value, (err, reply) => {
        if (err) {
	  reject(err);
	} else {
	  resolve(reply);
	}
      });
    });

    await new Promise((resolve, reject) => {
      this.client.expire(key, duration, (err, reply) => {
        if (err) {
	  reject(err);
	} else {
	  resolve(reply);
	}
      });
    });
  }

  async del(key) {
    await new Promise((resolve, reject) => {
      this.client.delete(key, (err, reply) => {
        if (err) {
	  reject(err);
	} else {
	  resolve(reply);
	}
      });
    });
  }
}

const redisClient = new RedisClient({
  host: 'localhost',
  port: 6379,
});

module.exports = redisClient;
