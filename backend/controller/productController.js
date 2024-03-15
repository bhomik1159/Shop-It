import { json } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import product from "../models/productModel.js";



const getProducts =asyncHandler(async(req,res)=>{
    const pageSize = 8;
    const page = Number(req.query.pageNumber)|| 1;
    const keyword = req.query.keyword ? {name: {$regex : req.query.keyword , $options: 'i'}} : {};
    const count = await product.countDocuments({...keyword});
    const products = await product.find({...keyword}).limit(pageSize).skip(pageSize * (page-1));
    res.json({products,page,pages: Math.ceil(count/pageSize)});
});

const getTopProducts = asyncHandler(async (req, res) => {
    const products = await product.find({}).sort({ rating: -1 }).limit(3);
  
    res.json(products);
  });

const getProductById = asyncHandler(async(req,res)=>{
    const productById = await product.findById(req.params.id);
    if(product){
        return res.json(productById);
    }
    else{
        res.status(404);
        throw new Error('product not found'); 
    }
});

const createdProduct =asyncHandler(async(req,res)=>{
    const newProduct = new product({
        name: 'Sample Name',
        price: 0,
        user: req.user.id,
        image: '/images/sample.jpg',
        brand: 'sample brand',
        category: 'sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample Description',
    });
    const createdProduct = await newProduct.save();
    res.status(200).json(createdProduct);
});

const editProduct =asyncHandler(async(req,res)=>{
    const {name,price,image,brand,category,countInStock,numReviews,description} = req.body;
    const productToEdit = await product.findById(req.params.id);
    if(productToEdit) {
        productToEdit.name = name;
        productToEdit.price = price;
        productToEdit.image = image;
        productToEdit.brand = brand;
        productToEdit.category = category;
        productToEdit.countInStock = countInStock;
        productToEdit.description = description;

        const updatedProduct = productToEdit.save();
        res.status(200).json(updatedProduct);
    }else{
        res.status(404);
        throw new Error('Resource Not Found');
    }
});
const deleteProduct =asyncHandler(async(req,res)=>{
    const productToDelete = await product.findById(req.params.id);
   if(productToDelete){
    await product.deleteOne({_id: productToDelete._id});
    res.status(200).json('product deleted');
   }else{
    res.status(404);
    throw new Error('Product Not Found');
   }
});

const createProductReview =asyncHandler(async(req,res)=>{
    const {rating , comment}= req.body;
    const productToReview = await product.findById(req.params.id);
   if(productToReview){
     const alreadyReviewed = productToReview.reviews.find((review)=>review.user.toString()===req.user.toString());
     if(alreadyReviewed){
        res.status(404);
        throw new Error('Product Already Reviewed');
     }
     const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
     };
     productToReview.reviews.push(review);
     productToReview.numReviews= productToReview.reviews.length;
     productToReview.rating= productToReview.reviews.reduce((acc,review)=>acc+review.rating,0)/productToReview.reviews.length;
     await productToReview.save();
     res.status(201).json({message: 'Review Added'});
   }
   else{
    res.status(404);
    throw new Error("Resource Not Found");
   }
});

export {getProductById,getProducts,createdProduct,editProduct,deleteProduct,createProductReview,getTopProducts};