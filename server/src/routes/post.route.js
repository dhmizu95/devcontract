const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const textValidate = require('../validations/text.validate');
const auth = require('../middlewares/auth.middleware');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', [auth, textValidate], postController.create_post);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, postController.all_post);

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
router.get('/:id', auth, postController.post_by_id);

// @route   DELETE api/posts/:id
// @desc    Delete post by authorized user
// @access  Private
router.delete('/:id', auth, postController.delete_post);

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, postController.like_post);

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, postController.unlike_post);

// @route   PUT api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.put('/comment/:id', [auth, textValidate], postController.comment_post);

// @route   Delete api/posts/comment/:id/:comment_id
// @desc    Delete a comment from a post
// @access  Private
router.delete(
	'/comment/:id/:comment_id',
	auth,
	postController.delete_comment_from_post
);

module.exports = router;
