const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    deliveryLink1: {
      type: String,
      default: 'https://t.me/fedexlogisticzdelivery',
    },
    deliveryLink2: {
      type: String,
      default: 'https://t.me/DHLlogisticzdelivery',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);