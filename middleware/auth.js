const Game = require('../models/game')

// check if user is a guest
exports.isGuest = (req, res, next) => {
	if (!req.session.user) {
		return next();
	} else {
		req.flash('error', 'You are logged in already.');
		return res.redirect('/users/profile');
	}
};

// check if user is logged in
exports.isLoggedIn = (req, res, next) => {
	if (req.session.user) {
		return next();
	} else {
		req.flash('error', 'You need to log in first.');
		return res.redirect('/users/login');
	}
};

// check if user is the seller of a game
exports.isSeller = (req, res, next) => {
	let id = req.params.id;
	Game.findById(id)
		.then((game) => {
			if (game) {
				if (game.seller == req.session.user) {
					return next();
				} else {
					let err = new Error('Unauthorized to access this resource.');
					err.status = 401;
					return next(err);
				}
			} else {
				let err = new Error('Cannot find a game with ID ' + id);
				err.status = 404;
				next(err);
			}
		})
		.catch((err) => next(err));
};

// check if user is not the seller of a game, and is able to bid on it
exports.isBidder = (req, res, next) => {
	(req.params);	
	let id = req.params.id;
	Game.findById(id)
		.then((game) => {
			if (game) {
				if (game.seller != req.session.user) {
					return next();
				} else {
					let err = new Error('Unauthorized to access this resource.');
					err.status = 401;
					return next(err);
				}
			} else {
				let err = new Error('Cannot find a game with ID ' + id);
				err.status = 404;
				next(err);
			}
		})
		.catch((err) => next(err));
};