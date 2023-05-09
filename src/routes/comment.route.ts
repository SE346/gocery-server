import { Router } from 'express';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';
import {
  getAllCommentBelongToProductController,
  getSingleCommentByIdController,
  addCommentController,
  updateCommentController,
} from '../controllers/comment.controller';

const router: Router = Router();

// [GET] /comment/p/{productId} -> Get all comment belong product
router.get('/p/:productId', verifyAccessToken, getAllCommentBelongToProductController);

// [GET] /comment/{commentId} -> Get single comment by id
router.get('/:commentId', verifyAccessToken, getSingleCommentByIdController);

// [POST] /comment -> Create new comment
router.post('/', verifyAccessToken, addCommentController);

// [PUT] /comment/{commentId} -> Update comment by id
router.put('/:commentId', verifyAccessToken, updateCommentController);

export default router;
