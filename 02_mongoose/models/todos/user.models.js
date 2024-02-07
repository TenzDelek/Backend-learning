import mongoose from 'mongoose'

const userSchema=new mongoose.Schema(
    {
        username:{
            type: String,
            required:true,
            unique:true,
            lowercase:true
        },
        email: String,
        password:{
            type:String,
            required:[true,"Password is Required"]// the second one will run if it is false
        },
        isActive: Boolean
    },
    {
        timestamps: true
    }
)

export const User=mongoose.model("User",userSchema)