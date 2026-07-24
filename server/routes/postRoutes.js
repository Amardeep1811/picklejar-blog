import express from 'express';
const router = express.Router();
import { getPosts, getPost, createPost, updatePost, deletePost, searchPosts } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { postSchema } from '../validators/postValidator.js';

router.route('/').get(getPosts).post(protect, role(['admin', 'editor']), validate(postSchema), createPost);
router.route('/search').get(searchPosts);
router.route('/:slug').get(getPost);
router.route('/:id')
  .put(protect, role(['admin', 'editor']), validate(postSchema), updatePost)
  .delete(protect, role(['admin', 'editor']), deletePost);

export default router;