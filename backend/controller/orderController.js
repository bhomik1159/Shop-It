import asyncHandler from "../middleware/asyncHandler.js";
import order from '../models/orderModel.js';

const addOrderItems = asyncHandler(async(req,res)=>{
        const {
            cartItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;
        if(cartItems && cartItems.length === 0){
            res.status(400);
            throw new Error('No Order Items');
        }else{
            const orderItems = cartItems.map((x)=>{
                return {
                    name: x.name,
                    qty: x.qty,
                    image: x.image,
                    price: x.price,
                    product: x._id,
                };
            });
            const createdOrder = new order({
                orderItems,
                user: req.body.userInfo._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });
            const savedOrder = await createdOrder.save();
            res.status(201).json(savedOrder);
        }

    
});

const getOderItems = asyncHandler(async(req,res)=>{
    const addedOrder = await order.find({user: req.user._id});
    res.status(200).json(addedOrder);
});
const getOderById = asyncHandler(async(req,res)=>{

    try{
        const oderById = await order.findById(req.params.id);
        if(oderById){
        res.status(201).json(oderById);
    }
    else{
        res.status(400);
        throw new Error('order not found');
    }
    }
    catch(error){
        console.log(error);
    }
    
});
const updateOrderToPaid =asyncHandler(async(req,res)=>{
    const editToPaid = await order.findById(req.params.id);
    try{
        if(editToPaid){
            editToPaid.isPaid = true;
            editToPaid.paidAt = Date.now();
            editToPaid.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                updateTime: req.body.updateTime,
                email_address: req.body.payer.email_address
            }
            const updateOrder = await editToPaid.save();
            res.status(200).json(updateOrder);
        }
        else{
            res.status(404);
            throw new Error('Order not found');
        }
    }catch(error){
        console.log(error);
    }

    
});
const updateOrderToDelivered =asyncHandler(async(req,res)=>{
    const orderToUpdate = await order.findById(req.params.id);
    if(orderToUpdate){
        orderToUpdate.isDelivered = true;
        orderToUpdate.deliveredAt = Date.now();
        const updatedOrder = await orderToUpdate.save();
        res.status(200).json(updatedOrder);
    }
    else{
        res.status(404);
        throw new Error('Order Not Found');
    }
});
const getAllOrders =asyncHandler(async(req,res)=>{
    try{
        const orders = await order.find({});
        res.status(200).json(orders);
    }
    catch(error){
        console.log(error);
    }
});
export {
    addOrderItems,
    getOderItems,
    getOderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getAllOrders
};