// modules
const express = require('express');
const controller = require('../controllers/offerController');
const { isBidder, isSeller } = require('../middleware/auth');
const { validateOffer, validateResult } = require('../middleware/validator');


const router = express.Router({mergeParams: true});

// POST /games/UUID/offers - Make an offer on a game
router.post('/', isBidder, validateOffer, validateResult, controller.create);

// GET /games/UUID/offers - Show all offers on a game
router.get('/', isSeller, controller.show);

// POST /games/UUID/offers/UUID/accept - accept an offer
router.post('/:offerId/accept', isSeller, controller.accept);

module.exports = router;