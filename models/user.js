const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
	firstName: { type: String, required: [true, 'First Name is required'] },
	lastName: { type: String, required: [true, 'Last Name is required'] },
	email: { type: String, required: [true, 'Email Address is required'], unique: [true, 'This email address is already registered with an account'] },
	password: { type: String, required: [true, 'Password is required'] },
},
	{ timestamps: true }
);

// Replace plaintext password with hashed password
userSchema.pre('save', function (next) {
	let user = this;
	if (!user.isModified('password'))
		return next();
	else {
		bcrypt.hash(user.password, 10)
			.then((hash) => {
				user.password = hash;
				next();
			})
			.catch((err) => next(err));
	}
});

// Compare plaintext password with hash
userSchema.methods.comparePassword = function (loginPassword) {
	return bcrypt.compare(loginPassword, this.password);
}


module.exports = mongoose.model('User', userSchema);