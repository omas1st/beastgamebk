const GameId = require('../models/GameId');
const Gift = require('../models/Gift');
const sendEmail = require('../utils/sendEmail');

exports.validateGameId = async (req, res) => {
  try {
    const { gameId } = req.body;
    const exists = await GameId.findOne({ gameId });
    if (!exists) return res.status(404).json({ message: 'Invalid game ID' });

    // Non‑blocking email notification
    sendEmail('User Validated Game ID', `Game ID: ${gameId} has been validated.`);

    res.status(200).json({ valid: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGifts = async (req, res) => {
  try {
    const gifts = await Gift.find();
    res.status(200).json(gifts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveSpin = async (req, res) => {
  try {
    const { gameId, giftId } = req.body;
    const game = await GameId.findOne({ gameId });
    if (!game) return res.status(404).json({ message: 'Game ID not found' });

    game.wonGift = giftId;
    game.step = Math.max(game.step, 1);
    await game.save();

    const gift = await Gift.findById(giftId);
    sendEmail('User Spun', `Game ID: ${gameId}\nWon Gift: ${gift ? gift.name : giftId}`);

    res.status(200).json({ message: 'Spin saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveDetails = async (req, res) => {
  try {
    const { gameId, name, email, phone, country, address } = req.body;
    const game = await GameId.findOne({ gameId });
    if (!game) return res.status(404).json({ message: 'Game ID not found' });

    game.userDetails = { name, email, phone, country, address };
    game.step = Math.max(game.step, 2);
    await game.save();

    const detailText = `
      Game ID: ${gameId}
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Country: ${country}
      Address: ${address}
      Delivery ID: ${game.deliveryId || 'N/A'}
    `;
    sendEmail('User Submitted Details', detailText);

    res.status(200).json({ message: 'Details saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.generateDelivery = async (req, res) => {
  try {
    const { gameId } = req.body;
    const game = await GameId.findOne({ gameId });
    if (!game) return res.status(404).json({ message: 'Game ID not found' });

    if (!game.deliveryId) {
      let deliveryId;
      let exists = true;
      while (exists) {
        deliveryId = Math.floor(100000 + Math.random() * 900000).toString();
        const duplicate = await GameId.findOne({ deliveryId });
        if (!duplicate) exists = false;
      }
      game.deliveryId = deliveryId;
    }
    game.step = Math.max(game.step, 3);
    await game.save();

    const detailText = `
      Game ID: ${gameId}
      Delivery ID: ${game.deliveryId}
      User Details:
      Name: ${game.userDetails?.name || 'N/A'}
      Email: ${game.userDetails?.email || 'N/A'}
      Phone: ${game.userDetails?.phone || 'N/A'}
      Country: ${game.userDetails?.country || 'N/A'}
      Address: ${game.userDetails?.address || 'N/A'}
    `;
    sendEmail('Delivery ID Generated', detailText);

    res.status(200).json({ deliveryId: game.deliveryId });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const { gameId } = req.query;
    const game = await GameId.findOne({ gameId }).populate('wonGift');
    if (!game) return res.status(404).json({ message: 'Game ID not found' });

    res.status(200).json({
      step: game.step,
      userDetails: game.userDetails,
      wonGift: game.wonGift,
      deliveryId: game.deliveryId,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};