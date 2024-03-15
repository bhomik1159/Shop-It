import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";
import users from "./data/users.js";
import products from "./data/products.js";
import user from "./models/userModel.js";
import product from "./models/productModel.js";
import order from "./models/orderModel.js";
import connectDB from "./config/db.js";
dotenv.config();
connectDB();
const importData= async()=>{
    try{
        await order.deleteMany();
        await product.deleteMany();
        await user.deleteMany();

        const createUser = await user.insertMany(users);
        const adminUser = createUser[0]._id;
        
        const sampleProducts = products.map((prdct)=>{
            return({...prdct, user: adminUser});
        });
        await product.insertMany(sampleProducts);
        console.log('data imported!'.green.inverse);
        process.exit();
    }
    catch(err){
        console.error(`Error: ${err.message}`.red.inverse);
        process.exit(1);

    }
};
const destroyData = async()=>{
    try{
        await order.deleteMany();
        await product.deleteMany();
        await user.deleteMany();
        console.log("data destroyed !".red.inverse);
        process.exit();
    }
    catch(err){
        console.error(`Error: ${err.message}`.red.inverse);
        process.exit(1);
    }

};
if(process.argv[2]==='-d'){
    destroyData();
}
else{
    importData();
}