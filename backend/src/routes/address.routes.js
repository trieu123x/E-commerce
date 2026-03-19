import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/address.controller.js';

const router = express.Router();

router.use(authMiddleware);

// CRUD Address
router.post('/', createAddress);
router.get('/', getUserAddresses);
router.get('/:id', getAddressById);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);
router.put('/:id/set-default', setDefaultAddress);


export default router;