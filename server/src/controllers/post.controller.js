const { validationResult } = require('express-validator');

const User = require('../models/user.model');
const Profile = require('../models/profile.model');
const Post = require('../models/post.model');
const { json } = require('express');
const { user } = require('./auth.controller');

// @route   POST api/post
// @desc    Create a post
// @access  Private
const create_post = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const user = await User.findById(req.user.id).select('-password');

		const newPost = new Post({
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id,
		});

		const post = await newPost.save();

		res.json(post);
	} catch (error) {
		console.error(error.message);
		res.status(500).json('Server error.');
	}
};

// @route   GET api/post
// @desc    Get all posts
// @access  Private
const all_post = async (req, res) => {
	try {
		const post = await Post.find().sort({ date: -1 });

		res.json(post);
	} catch (error) {
		console.error(error.message);
		res.status(500).json('Server error.');
	}
};

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
const post_by_id = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}

		res.json(post);
	} catch (error) {
		console.error(error.message);
		if (error.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found' });
		}

		res.status(500).json('Server error.');
	}
};

// @route   DELETE api/posts/:id
// @desc    Delete post by authorized user
// @access  Private
const delete_post = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}

		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' });
		}

		await post.remove();

		res.json({ msg: 'Post removed.' });
	} catch (error) {
		console.error(error.message);
		if (error.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found' });
		}

		res.status(500).json('Server error.');
	}
};

module.exports = { create_post, all_post, post_by_id, delete_post };
