// modules
const express = require('express');
const offerRoutes = require('../routes/offerRoutes');
const controller = require('../controllers/gameController');
const { upload } = require('../middleware/fileUpload');
const { isLoggedIn, isSeller } = require('../middleware/auth');
const { validateId } = require('../middleware/validator');
const { validateGame, validateResult } = require('../middleware/validator');


const router = express.Router();

// GET /games - Send all games
router.get('/', controller.index);

// GET /games/new - Send new game form
router.get('/new', isLoggedIn, controller.new);

// POST /games - Create a new game from form
router.post('/', isLoggedIn, upload, validateGame, validateResult, controller.create);

// GET /games/UUID - Send specific game page
router.get('/:id', validateId, controller.show);

// GET /games/UUID/edit - Send form to edit specific game
router.get('/:id/edit', isLoggedIn, validateId, isSeller, controller.edit);

// PUT /games/UUID - Update specific game from form
router.put('/:id', isLoggedIn, validateId, isSeller, upload, validateGame, validateResult, controller.update);

// DELETE /games/UUID - Delete specific game from button
router.delete('/:id', isLoggedIn, validateId, isSeller, controller.delete);

// offer routes
router.use('/:id/offers', isLoggedIn, validateId, offerRoutes);

module.exports = router;