import { Router } from 'express';
import {
  getAllAddressBelongToUserController,
  addNewAddressController,
  removeAddressController,
  updateAddressController,
} from '../controllers/address.controller';
import { verifyAccessToken } from '../utils/jwt_service';

const router: Router = Router();

// [GET] /address/get-all -> Get all address belong to user
router.get('/get-all', verifyAccessToken, getAllAddressBelongToUserController);

// [POST] /address/add -> Create new address
router.post('/add', verifyAccessToken, addNewAddressController);

// [POST] /address/{addressId} -> Update address
router.post('/:addressId', verifyAccessToken, updateAddressController);

// [DELETE] /address/{addressId} -> Remove one address
router.delete('/:addressId', verifyAccessToken, removeAddressController);

export default router;
