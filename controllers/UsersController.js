const postNew = async (req, res) => {
  const { email, password } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Missing passowrd' })
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

  const newUser = new User({
    email,
    password: hashedPassword
  });

  try {
    await newUser.save();

    await userQueue.add({ userId: newUser._id });
    
    res.status(201).json({ email: newUser.email, id: newUser._id });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMe = async (req, res) => {
  const token = req.headers['x-token'];
  if (!token) {
    return res.status(401).json({ erro: 'Unauthorized' });
  }

  const key = `auth_${token}`;
  const userId = await redisClient.get(key);

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(200).json({ email: user.email, id: user._id });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  postNew,
  getMe,
};
