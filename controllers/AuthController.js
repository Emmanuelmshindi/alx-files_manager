const { User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const redisClient = require('../redisClient');

const getConnect = (req, res) => {
  if (!req.get('Authorization')) {
    var err = new Error('Not Authenticated!')
    res.status(401).set('WWW-Authenticate', 'Basic')
  } else {
    var credentials = Buffer.from('Authorization').split(' ')[1], 'base64')
    .toString()
    .split(':')

    var username = credentials[0]
    var password = credentials[1]
  }
  const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
  const user = await User.findOne({ email, password: hashedPassword });

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = uuidv4();

  const key = `auth_${token}`;
  redisClient.setex(key, 86400, user._id.toString());
};

const getDisconnect = (req, res) => {
  const token = req.headers['x-token'];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
  }

  const key = `auth_${token}`;
  const userId = await redisClient.get(key);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  redisClient.del(key);

  res.status(204).end();
};

module.exports = {
  getConnect,
  getDisconnect,
};
