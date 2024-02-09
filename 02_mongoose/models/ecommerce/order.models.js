import mongoose from 'mongoose'

//mini schema for order items
const orderItemSchema=new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:Number,
        required:true
    }
})


const orderSchema=new mongoose.Schema({
    orderPrice:{
        type:Number,
        required:true,    
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    orderItems:{
        type:[orderItemSchema] //we can write this in the way like [{type:,ref}]
    },
    address:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["PENDING","CANCELLED","DELIVERED"], //ONLY FROM THIS OPTION U CAN CHOOSE
        default:"PENDING"
    }
},{timestamps:true})


export const Order=mongoose.model("Order",orderSchema)