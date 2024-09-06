const model = require('../models/game');
const Offer = require('../models/offer');

// GET /games - Send all games
exports.index = (req, res, next) => {
	const renderPage = (games) => {
		// sort games by price after promise is returned, and before rendered in ejs 
		games.sort((a, b) => a.price - b.price);
		// remove inactive games before render
		games = games.filter((game) => game.active)
		res.render('./game/index', { games, searchTerm });
	}
	let searchTerm;
	if (req.query.search) {
		// Handle search term from query parameters if found
		searchTerm = req.query.search;
		model.find({ $text: { $search: searchTerm } })
			.then(renderPage)
			.catch((err) => next(err));
	} else {
		model.find()
			.then(renderPage)
			.catch((err) => next(err));
	}
};

// GET /games/new - Send new game form
exports.new = (req, res) => {
	res.render('./game/new');
};

// POST /games - Create a new game from form
exports.create = (req, res, next) => {
	let game = new model(req.body);
	// Initialize with 0 offers
	game.totalOffers = 0;
	// Initialize as active
	game.active = true;
	// Add image (if statement prevents a TypeError before Validation Error is caught)
	if (req.file) {
		game.image = req.file.filename;
	}
	// Set seller to logged in user
	game.seller = req.session.user;

	game.save()
		.then(() => {
			req.flash('success', 'Your game was listed successfully.');
			res.redirect('/games')
		})
		.catch((err) => {
			if (err.name === "ValidationError") {
				req.flash('error', err.message);
				return res.redirect('back');
			}
			next(err);
		});
};

// GET /games/UUID - Send specific game page
exports.show = (req, res, next) => {
	let id = req.params.id;
	model.findById(id).populate('seller', 'firstName lastName')
		.then((game) => {
			if (game) {
				return res.render('./game/show', { game });
			} else {
				let err = new Error('Cannot find a game with ID ' + id);
				err.status = 404;
				next(err);
			}
		})
		.catch((err) => next(err));
};

// GET /games/UUID/edit - Send form to edit specific game
exports.edit = (req, res, next) => {
	let id = req.params.id;
	model.findById(id)
		.then((game) => {
			res.render('./game/edit', { game });
		})
		.catch((err) => next(err));

};

// PUT /games/UUID - Update specific game from form
exports.update = (req, res, next) => {
	let game = req.body;
	let id = req.params.id;

	// refresh updatedAt date
	game.updatedAt = new Date();

	// Save image path to game object only if new image is uploaded
	if (req.file) {
		game.image = req.file.filename;
	}

	model.findByIdAndUpdate(id, game, { useFindAndModify: false, runValidators: true })
		.then(() => {
			req.flash('success', 'Your listing was updated successfully.');
			res.redirect('/games/' + id);
		})
		.catch((err) => {
			if (err.name === "ValidationError") {
				req.flash('error', err.message);
				return res.redirect('back');
			}
			next(err)
		});
};

// DELETE /games/UUID - Delete specific game from button
exports.delete = (req, res, next) => {
	let id = req.params.id;
	// Delete game and associated offers
	Promise.all([model.findByIdAndDelete(id, { useFindAndModify: false }), Offer.deleteMany({game: id})])
		.then(() => {
			req.flash('success', 'Your listing was deleted successfully.');
			res.redirect('/games/');
		})
		.catch((err) => next(err));
};
