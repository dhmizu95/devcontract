const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const postValidate = require('../validations/post.validate');
const auth = require('../middlewares/auth.middleware');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', [auth, postValidate], postController.create_post);

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

module.exports = router;
