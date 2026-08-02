const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.post('/validate-gameid', apiController.validateGameId);
router.get('/gifts', apiController.getGifts);
router.post('/save-spin', apiController.saveSpin);
router.post('/save-details', apiController.saveDetails);
router.post('/generate-delivery', apiController.generateDelivery);
router.get('/user-data', apiController.getUserData);

module.exports = router;