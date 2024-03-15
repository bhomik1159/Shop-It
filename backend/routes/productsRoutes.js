import express from "express";
import {getProductById,getProducts,createdProduct,editProduct,deleteProduct,createProductReview,getTopProducts} from '../controller/productController.js';
import {protect,admin} from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(getProducts).post(protect,admin,createdProduct);
router.get('/top', getTopProducts);
router.route('/:id').get(getProductById).put(protect,admin,editProduct).delete(protect,admin,deleteProduct);
router.route('/:id/reviews').post(protect,createProductReview);
export default router;