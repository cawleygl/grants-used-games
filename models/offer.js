const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
	amount:{ type: Number, min: [0.01, 'offer must greater than 0'], required: [true, 'offer is required'] },
	status: { type: String, enum: [
		"pending",
		"rejected",
		"accepted"
	], required: [true, 'status is required'], default: "pending" },
	bidder: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'bidder is required']},
	game: {type: Schema.Types.ObjectId, ref: 'Game',  required: [true, 'game is required']},
},
	{ timestamps: true }
);


module.exports = mongoose.model('offer', offerSchema);