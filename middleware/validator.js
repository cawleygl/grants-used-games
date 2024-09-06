const { body, validationResult } = require('express-validator');

// check if game id is valid
exports.validateId = (req, res, next) => {
	let id = req.params.id;
	if (id.match(/^[0-9a-fA-F]{24}$/)) {
		return next();
	} else {
		let err = new Error('Invalid Game ID');
		err.status = 400;
		return next(err);
	}
};

// validate signup request using express-validator
exports.validateSignUp = [
	body('firstName', 'First Name cannot be empty.').notEmpty().trim().escape(),
	body('lastName', 'Last Name cannot be empty.').notEmpty().trim().escape(),
	body('email', 'Email must be a valid email address.').isEmail().trim().escape().normalizeEmail(),
	body('password', 'Password must be at least 8 characters and at most 64 characters.').isLength({ min: 8, max: 64 })
];

// validate login request using express-validator
exports.validateLogIn = [
	body('email', 'Email must be a valid email address.').isEmail().trim().escape().normalizeEmail(),
	body('password', 'Password must be at least 8 characters and at most 64 characters.').isLength({ min: 8, max: 64 })
];

exports.validateGame = [
	body('title', 'Title cannot be empty.').notEmpty().trim().escape(),
	body('releaseYear', 'Release Year must be after 1899.').isInt({min: 1900}).trim().escape(),
	body('platform', 'Platform must be a valid option.').trim().escape().isIn([
		"NES",
		"SNES",
		"PS1",
		"N64",
		"PS2",
		"XB",
		"NGC",
		"X360",
		"PS3",
		"Wii",
		"WiiU",
		"PS4",
		"XB1",
		"NS",
		"XSX",
		"PS5",
		"PC"
	]),
	body('condition', 'Condition must be a valid option.').trim().escape().isIn([
		"New In Wrapping", 
		"Like New", 
		"Cosmetically Flawed", 
		"Used", 
		"Poor"
	]),
	body('price', 'Price must be greater than 0.').isFloat({min: 0.01}).trim().escape(),
	body('details', 'Details cannot be empty.').notEmpty().trim().escape(),
];

exports.validateOffer = [
	body('amount', 'Amount must be greater than 0.').isFloat({min: 0.01}).trim().escape(),
];

exports.validateResult = (req, res, next) => {
	// Check for validation errors and redirect
	let errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors.array().forEach((error) => {
			req.flash('error', error.msg);
		})
		return res.redirect('back');
	} else {
		return next();
	}
};

