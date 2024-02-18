import mongoose, { Schema, model } from "mongoose"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const userSchema=new Schema(
    {
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String, // cloudinary url
        required:true
    },
    coverImage:{
       type:String 
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,'Password is required']
    },
    refreshToken:{
        type:String
    }

},{timestamps:true})

//pre- before the data is about to get save
//we can use pre hook(middlewere) to run some command
//we will use this to encrypt
//here we are using normal function-why because the callback doesnt have the reference of this(context)

//here next is after the hash is done do the next which is save
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next(); // this is due to that if some other field like name changes just return
    this.password=await bcrypt.hash(this.password,10)//here 10 is just a hashround
    next()
})

//here to encrypt the password we use bcrypt library
//and to generate token we are using jwt(json web token)
//jwt has three part: header,payload(just a fancy name for data) and verify signature
//the secret is the one which protect all of it

userSchema.methods.isPasswordCorrect=async function(password){
  return  await bcrypt.compare(password,this.password)
}



//jwt is a bearer token--means which ever has the key,it send its data to them(so dont lost the key)
userSchema.methods.generateAccessToken=function(){
   return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}

//expiry of refresh is usally kept higher
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}
export const User=model("User",userSchema)