import express from "express";
import {addOrderItems,getOderItems,getOderById,updateOrderToPaid,updateOrderToDelivered,getAllOrders} from '../controller/orderController.js';
import {protect,admin} from "../middleware/authMiddleware.js";
const router = express.Router();

router.route('/').post(addOrderItems).get(protect,admin,getAllOrders);
router.route('/myorders').get(protect,getOderItems);
router.route('/:id').get(protect,getOderById);
router.route('/:id/pay').put(protect,updateOrderToPaid);
router.route('/:id/deliver').put(protect,admin,updateOrderToDelivered);

export default router;