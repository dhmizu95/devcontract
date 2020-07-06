const express = require('express');
const morgan = require('morgan');
const port = require('config').get('port');

const connectDB = require('./helpers/db.helper');

const app = express();

// Init middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
	res.send('Hello World!');
});

// Use Router
app.use('/api/user', require('./routes/user.route'));
app.use('/api/profile', require('./routes/profile.route'));
app.use('/api/post', require('./routes/post.route'));
app.use('/api/auth', require('./routes/auth.route'));

// Connect mongoDB & listening the server
connectDB().then(() =>
	app.listen(port, () => {
		console.log(`Server started on port ${port}!`);
	})
);
