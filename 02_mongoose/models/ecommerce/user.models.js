import mongoose from "mongoose";

//first step is to make a schema then the export it using
//the model
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
},{timestamps:true})

export const User=mongoose.model("User",userSchema)
