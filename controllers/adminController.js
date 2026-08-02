const GameId = require('../models/GameId');
const Gift = require('../models/Gift');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'spin-game-gifts' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// GAME ID MANAGEMENT

exports.getGameIds = async (req, res) => {
  try {
    const games = await GameId.find().sort({ createdAt: -1 }).populate('wonGift');
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createGameId = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Game ID required' });
    const exists = await GameId.findOne({ gameId: id });
    if (exists) return res.status(400).json({ message: 'Game ID already exists' });

    const newGame = new GameId({ gameId: id });
    await newGame.save();
    res.status(201).json(newGame);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateGameId = async (req, res) => {
  try {
    const { gameId } = req.params;
    const updateData = req.body;
    const game = await GameId.findOne({ gameId });
    if (!game) return res.status(404).json({ message: 'Game ID not found' });

    if (updateData.gameId && updateData.gameId !== game.gameId) {
      const duplicate = await GameId.findOne({ gameId: updateData.gameId });
      if (duplicate) return res.status(400).json({ message: 'New Game ID already exists' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key === 'userDetails' && typeof updateData.userDetails === 'object') {
        game.userDetails = { ...game.userDetails, ...updateData.userDetails };
      } else if (key === 'step') {
        game.step = parseInt(updateData.step, 10);
      } else if (key === 'deliveryId') {
        game.deliveryId = updateData.deliveryId;
      } else if (key === 'gameId') {
        game.gameId = updateData.gameId;
      }
    });
    await game.save();
    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteGameId = async (req, res) => {
  try {
    const { gameId } = req.params;
    const result = await GameId.findOneAndDelete({ gameId });
    if (!result) return res.status(404).json({ message: 'Game ID not found' });
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GIFT MANAGEMENT

exports.getGifts = async (req, res) => {
  try {
    const gifts = await Gift.find().sort({ createdAt: -1 });
    res.status(200).json(gifts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addGift = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Gift name is required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Gift image is required' });
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer);
    const gift = new Gift({ name: name.trim(), image: imageUrl });
    await gift.save();
    res.status(201).json(gift);
  } catch (err) {
    console.error('Add gift error:', err);
    res.status(500).json({ message: 'Failed to add gift. ' + err.message });
  }
};

exports.updateGift = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const gift = await Gift.findById(id);
    if (!gift) return res.status(404).json({ message: 'Gift not found' });

    if (name) gift.name = name.trim();
    if (req.file) {
      gift.image = await uploadToCloudinary(req.file.buffer);
    }
    await gift.save();
    res.status(200).json(gift);
  } catch (err) {
    console.error('Update gift error:', err);
    res.status(500).json({ message: 'Failed to update gift' });
  }
};

exports.deleteGift = async (req, res) => {
  try {
    const { id } = req.params;
    const gift = await Gift.findByIdAndDelete(id);
    if (!gift) return res.status(404).json({ message: 'Gift not found' });
    res.status(200).json({ message: 'Gift deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};