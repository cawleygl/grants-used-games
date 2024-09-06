const model = require('../models/offer');
const Game = require('../models/game');

// POST /offers/UUID - Create a new offer on a game
exports.create = (req, res, next) => {
	let offer = new model(req.body);
	let gameId = req.params.id;
	let amount = req.body.amount;

	// Set bidder to be logged in user
	offer.bidder = req.session.user;
	// Set game field to game id 
	offer.game = gameId

	// Initialize status to pending
	offer.status = 'pending';

	// Save offer and Update totalOffers on game 
	Promise.all([offer.save(), Game.findByIdAndUpdate(gameId, {$inc: {totalOffers: 1}, $max: {highestOffer: amount}})])
		.then(() => {
			req.flash('success', 'Your offer was made successfully.');
			res.redirect('/games/' + gameId);
		})
		.catch((err) => {
			if (err.name === "ValidationError") {
				req.flash('error', err.message);
				return res.redirect('back');
			}
			next(err);
		});
};

// Display all offers on a game
exports.show = (req, res, next) => {
	let gameId = req.params.id;
	Promise.all([model.find({ game: gameId }).populate('bidder', 'firstName lastName'), Game.findById(gameId)])
		.then((results) => {
			const [ offers, game ] = results;
			// Sort offers by amount before rendering
			offers.sort((b, a) => a.amount - b.amount);
			res.render('./offer/show', { offers, game });
		})
		.catch((err) => next(err));
};

// Handle accepting an offer
exports.accept = (req, res, next) => {
	let gameId = req.params.id;
	let offerId = req.params.offerId;

	// Set game to inactive, offer to accepted, other offers to rejected 
	Promise.all([Game.findByIdAndUpdate(gameId, {active: false}), model.updateMany({_id: {$ne: offerId}, game: gameId }, {status: "rejected"}), model.findByIdAndUpdate(offerId, {status: "accepted"} )])
	.then(() => {
		req.flash('success', 'You have successfully accepted the offer on your game.');
		res.redirect('/games/' + gameId + "/offers");
	})
	.catch((err) => {
		if (err.name === "ValidationError") {
			req.flash('error', err.message);
			return res.redirect('back');
		}
		next(err);
	});
};