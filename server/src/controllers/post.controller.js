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

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
const like_post = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		const likedByUser = post.likes.filter(
			(like) => like.user.toString() === req.user.id
		);

		if (likedByUser.length > 0) {
			return res.status(404).json({ msg: 'Post already liked.' });
		}

		post.likes.unshift({ user: req.user.id });
		await post.save();

		res.json(post.likes);
	} catch (error) {
		console.error(error.message);
		res.status(500).json('Server error.');
	}
};

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
const unlike_post = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		const likedByUser = post.likes.filter(
			(like) => like.user.toString() === req.user.id
		);

		if (likedByUser.length === 0) {
			return res.status(404).json({ msg: 'Post has not yet been liked.' });
		}

		const removeIndex = post.likes
			.map((like) => like.user.toString())
			.indexOf(req.user.id);

		post.likes.splice(removeIndex, 1);
		await post.save();

		res.json(post.likes);
	} catch (error) {
		console.error(error.message);
		res.status(500).json('Server error.');
	}
};

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
const comment_post = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const user = await User.findById(req.user.id).select('-password');
		const post = await Post.findById(req.params.id);

		const newComment = {
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id,
		};

		post.comments.unshift(newComment);

		await post.save();

		res.json(post.comments);
	} catch (error) {
		console.error(error.message);
		res.status(500).json('Server error.');
	}
};

// @route   Delete api/posts/comment/:id/:comment_id
// @desc    Delete a comment from a post
// @access  Private
const delete_comment_from_post = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		const comment = post.comments.find(
			(comment) => comment.id === req.params.comment_id
		);

		if (!comment) {
			return res.status(404).json({ msg: 'Comment does not exists.' });
		}

		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized.' });
		}

		const removeIndex = post.comments
			.map((comment) => comment.user.toString())
			.indexOf(req.user.id);

		post.comments.splice(removeIndex, 1);
		await post.save();

		res.json(post.comments);
	} catch (error) {
		console.error(error.message);
		res.status(500).json('Server error.');
	}
};

module.exports = {
	create_post,
	all_post,
	post_by_id,
	delete_post,
	like_post,
	unlike_post,
	comment_post,
	delete_comment_from_post,
};
