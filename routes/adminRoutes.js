const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const adminController = require('../controllers/adminController');

// Game ID routes
router.get('/gameids', adminController.getGameIds);
router.post('/gameids', adminController.createGameId);
router.put('/gameids/:gameId', adminController.updateGameId);
router.delete('/gameids/:gameId', adminController.deleteGameId);

// Gift routes
router.get('/gifts', adminController.getGifts);
router.post('/gifts', upload.single('image'), adminController.addGift);
router.put('/gifts/:id', upload.single('image'), adminController.updateGift);
router.delete('/gifts/:id', adminController.deleteGift);

module.exports = router;