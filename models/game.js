const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
	title: { type: String, required: [true, 'title is required'] },
	image: { type: String, required: [true, 'image is required'] },
	releaseYear: { type: Number, min: [1900, 'release year must be after 1899'], required: [true, 'release year is required'] },
	platform: { type: String, enum: [
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
	], required: [true, 'platform is required'] },
	condition: { type: String, enum: [
		"New In Wrapping", 
		"Like New", 
		"Cosmetically Flawed", 
		"Used", 
		"Poor"
	], required: [true, 'condition is required'] },
	price: { type: Number, min: [0.01, 'price must greater than 0'], required: [true, 'price is required'] },
	seller: { type: Schema.Types.ObjectId, ref: 'User' },
	details: { type: String, required: [true, 'details are required'] },
	totalOffers: { type: Number, min: [0, 'totalOffers cannot be negative'], default: 0 },
	highestOffer: { type: Number, min: [0, 'highestOffer cannot be negative'], default: 0 },
	active: { type: Boolean, default: true },
},
{timestamps: true}
);

module.exports = mongoose.model('Game', gameSchema);

