import { Router } from 'express';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';
import {
  getAllCommentBelongToProductController,
  getSingleCommentByIdController,
  addCommentController,
} from '../controllers/comment.controller';

const router: Router = Router();

// [GET] /comment/p/{productId} -> Get all comment belong product
router.get('/p/:productId', verifyAccessToken, getAllCommentBelongToProductController);

// [GET] /comment/{commentId} -> Get single comment by id
router.get('/:commentId', verifyAccessToken, getSingleCommentByIdController);

// [POST] /comment -> Create new comment
router.post('/', verifyAccessToken, addCommentController);

export default router;
