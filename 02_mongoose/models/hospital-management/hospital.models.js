import mongoose from "mongoose";

const hospitalSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    addressline1:{
        type:String,
        required:true
    },
    addressline2:{
        type:String
    },
    city:{
        type:String,
        required:true
    },
    pinCode:{
        type:String,
        required:true
    },
    specializedIn:[{
        type:String,
    }]
},{timestamps:true})

export const Hospital=mongoose.model('Hospital',hospitalSchema)