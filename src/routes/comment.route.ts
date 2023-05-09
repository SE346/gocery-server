import { Router } from 'express';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';
import { getAllCommentBelongToProduct } from '../controllers/comment.controller';

const router: Router = Router();

// [GET] /comment/p/{productId} -> Get all comment belong product
router.get('/p/:productId', verifyAccessToken, getAllCommentBelongToProduct);

export default router;
