const mongoose = require('mongoose');

const gameIdSchema = new mongoose.Schema(
  {
    gameId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // User progress fields
    step: {
      type: Number,
      default: 0, // 0: validated, 1: spun, 2: details filled, 3: delivery generated
    },
    wonGift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gift',
      default: null,
    },
    userDetails: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      country: { type: String, default: '' },
      address: { type: String, default: '' },
    },
    deliveryId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

module.exports = mongoose.model('GameId', gameIdSchema);