const postUpload = async (req, res) => {
  const userId = req.user.id;

  const { name, type, parentId = 0, isPublic = false, data } = req.file;

  if (!name) {
    res.status(400).json({ error: 'Missing name' });
  }

  if (!type || !['folder', 'file', 'image'].includes(type)) {
    res.status(400).json({ error: 'Missing type' });
  }

  if (type !== 'folder' && !data) {
    res.status(400).json({ error: 'Missing data' });
  }

  if (parentId !== 0) {
    const parentFile = await File.findById(parentId);
    if (!parentFile) {
      res.status(400).json({ error: 'Parent not found'});
    }
    if (parentFile.type !== 'folder') {
      res.status(400).json({ 'Parent is not a folder' });
    }
  }

  try {
    const file = new File({
      userId,
      fileId,
      fileType,
      name,
      type,
      parentId,
      isPublic
    });

    if (type === 'file' || type === 'image') {
      const folderPath = process.env.FOLDER_PATH || 'tmp/files_manager';
      const filePath = path.join(folderPath, uuidv4());
      fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
      file.localPath = filePath;
    }

    await file.save();

    await fileQueue.add({ userId, fileId });

    res.status(201).json(file);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ Error: 'Internal server error' });
  }  
};

const getShow = async (req, res) => {
  try {
    const user = await User.findOne({ token: req.headers.authorization });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const file = await File.findOne({ _id: req.params.id, user: user._id });

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getIndex = async (req, res) => {
  try {
    const User = await User.findOne({ token: req.headers.authorization });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const parentId = req.query.parentId || '0';
    const page = parseInt(req.query.page) || 0;
    const limit = 20;
    const skip = page * limit;

    const pipeline = [
      { $match: { user: user._id, parentId } },
      { $skip: skip },
      { $limit: limit}
    ];

    const files = await File.aggregate(pipeline);

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const putPublish = async (req, res) => {
  try {
    const user = await User.findOne({ token: req.headers.authorization });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const file = await File.findOne({ _id: req.params.id, user: user._id });

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    file.isPublic = true;
    await file.save();
    res.json(file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const putUnpublish = async (req, res) => {
  try {
    const user = await User.findOne({ token: req.headers.authorization });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const file = await File.findOne({ _id: req.params.id, user: user._id });

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    file.isPublic = false;
    await file.save();
    res.json(file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      res.status(404).json({ error: 'Not found' });
    }

    if (!file.isPublic) {
      const user = await User.findOne({ token: req.headers.authorization });

      if (!user || !user._id.equals(file.user)) {
        return res.status(404).json({ error: 'Not found' });
      }
    }

    if (file.type === 'folder') {
      return res.status(404).json({ error: "A folder doesn't have content" });
    }

    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    if (!fs.existSync(filePath)) {
      return res.status(404).json({ error: 'Not found' });
    }

    const mimeType = mime.lookup(file.filename);
    res.set('Content-Type', mimeType);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  postUpload,
  getShow,
  getIndex,
  putPublish,
  putUnpublish,
  getFile,
};
