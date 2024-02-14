const { redis.isAlive, db.isAlive, db.nbUsers, db.nbFiles } = require('../utils');

const getStatus = (req, res) => {
  const redisStatus = redis.isAlive();
  const dbStatus = db.isAlive();

  if (redisStatus && dbStatus) {
    res.status(200).json({ redis: true, db: true });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStats = (req, res) => {
  const userNum = nbUsers();
  const fileNum = nbFiles();

  res.status(200).json({ "users": userNum, "files": fileNum })
}

module.exports = {
  getStatus,
  getStats,
};
