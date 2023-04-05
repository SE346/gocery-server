import { Router } from 'express';
import { getAllAddressBelongToUser } from '../controllers/address.controller';

const router: Router = Router();

// [GET] /address/get-all -> Get all address belong to user
router.get('/get-all', getAllAddressBelongToUser);

export default router;
