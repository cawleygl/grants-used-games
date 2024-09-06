const model = require('../models/user');
const Game = require('../models/game');
const Offer = require('../models/offer');

// GET /users/new - Send new user form
exports.new = (req, res) => {
	return res.render('./user/new');
};

// POST /users - Create a new user account
exports.create = (req, res, next) => {
	let user = new model(req.body);

	user.save()
		.then(() => {
			req.flash('success', 'You have successfully registered your account.');
			res.redirect('/users/login')
		})
		.catch((err) => {
			if (err.name === 'ValidationError') {
				req.flash('error', err.message);
				return res.redirect('/users/new');
			}

			if (err.code === 11000) {
				req.flash('error', 'Email Address has been used.');
				return res.redirect('/users/new');
			}

			next(err);
		});
};

// GET /users/login - Send login form
exports.login = (req, res, next) => {
	return res.render('./user/login');
};

// POST /users/login - Authenticate user login request
exports.authenticate = (req, res, next) => {
	let email = req.body.email;
	let password = req.body.password;

	// get user that matches the email
	model.findOne({ email: email })
		.then((user) => {
			if (user) {
				user.comparePassword(password)
					.then((result) => {
						if (result) {
							req.session.user = user._id; // store user's id in the session
							req.flash('success', 'You have successfully logged in.'); // save flash message on login
							res.redirect('/users/profile');
						} else {
							req.flash('error', 'Incorrect Password');
							res.redirect('/users/login');
						}
					})
			} else {
				req.flash('error', 'Email Address Not Found');
				res.redirect('/users/login')
			}

		})
		.catch((err) => next(err));
};

// GET /users/profile - Send user profile
exports.profile = (req, res, next) => {
	let id = req.session.user;
	Promise.all([model.findById(id), Game.find({ seller: id }), Offer.find({ bidder: id }).populate('game', 'id title releaseYear'), ])
		.then((results) => {
			const [user, games, offers] = results;
			res.render('./user/profile', { user, games, offers });
		})
		.catch((err) => next(err));
};

// GET /users/profile - Send user profile
exports.logout = (req, res, next) => {
	req.session.destroy((err) => {
		if (err) return next(err);
		else res.redirect('/users/login');
	});
};