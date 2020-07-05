const express = require('express');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { port } = require('./config/keys');

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
	res.send('Hello World!');
});

// Use Router
app.use('/api/users', require('./routes/users.route'));
app.use('/api/profile', require('./routes/profile.route'));
app.use('/api/posts', require('./routes/posts.route'));
app.use('/api/auth', require('./routes/auth.route'));

// Connect mongoDB & listening the server
connectDB().then(() =>
	app.listen(port, () => {
		console.log(`Server started on port ${port}!`);
	})
);
