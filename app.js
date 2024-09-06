// modules
const express = require('express');
const morgan = require('morgan');
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes');
const methodOverride = require('method-override');
const multer = require('multer');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// create app
const app = express();

// configuration
let port = 3000;
let host = 'localhost';
let url = 'mongodb+srv://gcawley:ii5Mex0J2T9eIjy2@cluster0.sjdexg4.mongodb.net/project3?retryWrites=true&w=majority&appName=Cluster0';
app.set('view engine', 'ejs');

// connect to Mongodb
mongoose.connect(url)
	.then(() => {
		// start the server
		app.listen(port, host, () => {
			console.log("Server is running on port", port);
		});
	})
	.catch((err) => console.log(err.message));


// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(session({
	secret: 'lksehfiuiw4efjewcriljnqewkrufw',
	resave: false,
	saveUninitialized: false,
	cookie: {maxAge: 60*60*1000}, //1 hour
	store: new MongoStore({mongoUrl: url})
}));

app.use(flash());

app.use((req, res, next) => {
	res.locals.user = req.session.user || null;
	res.locals.successMessages = req.flash('success');
	res.locals.errorMessages = req.flash('error');
	next();
});

// routes - landing page
app.get('/', (req, res) => {
	res.render('index');
});
// game routes
app.use('/games', gameRoutes);

// user routes
app.use('/users', userRoutes);

// 404 error handling
app.use((req, res, next) => {
	let err = new Error('The server cannot locate ' + req.url);
	err.status = 404;
	next(err);
});

// Multer file too large error handling
app.use((err, req, res, next) => {
	if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
		err.status = 400;
	}
	next(err);
});

// default error handling
app.use((err, req, res, next) => {
	// Print call stack to console
	console.log(err.stack);
	// Set default status and message if not defined
	if (!err.status) {
		err.status = 500;
		err.message = ("Internal Server Error");
	}
	res.status(err.status);
	res.render('error', { error: err });
})

