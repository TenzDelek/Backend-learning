import mongoose from "mongoose";

const todoSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,  
    },
    complete:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,//this indicate that we are going to get a reference
        ref:"User" // that name should be similar to export not this one-->User=mongoose.model("User"<-- this one,userSchema)
    }, 
    subTodos:[
        {
           type: mongoose.Schema.Types.ObjectId,
           ref:"SubTodo"
        }
    ]
},{timestamps:true})  

export const Todo=mongoose.model("Todo",todoSchema)