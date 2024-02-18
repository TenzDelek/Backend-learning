import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadoncloudinary}  from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
const registerUser=asyncHandler(async(req,res)=>{
     //get user details from frontend - here only data are handle for file to get handle we do that in userroute with upload(multer)
     const {fullName,email,username,password}=req.body
     console.log("email:",email)
     //validation - not empty
        if([fullName,email,username,password].some((field)=>field?.trim()==="")) //here if anyone field got empty it return true which make use easy to find the error(no need for wrting whole if again and again)
        {
            throw new ApiError(400,"All fields are required")
        }
    //check if usre already exists:username,email
    const existedUser=User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser)
    {
        throw new ApiError(409,"User with that given email or name already exist")
    }
    //check for images, check for avatar
    const avatarlocalpath=req.files?.avatar[0]?.path //files is from multer
    const coverimagelocalpath=req.files?.coverImage[0]?.path
    
    if(!avatarlocalpath)
    {
        throw new ApiError(400,"avatar is required")
    }
    //upload them to cloudinary,avatar check
    const avatar=await uploadoncloudinary(avatarlocalpath)
    const coverImage=await uploadoncloudinary(coverimagelocalpath)
    if(!avatar)
    {
      throw new ApiError(400,"avatar file is required")  
    }
    //create user objects- create entry in db
    //--User is the one that talks with the database
    const user=awaitUser.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || '',
        email,
        password,
        username:username.toLowerCase()
    })
    //for each entry mongo generate an id
     //remove password and refresh token field from response
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    ) // the syntax for select is new- what we do is if we dont want passowrd and token field just write - infront of it

    //check for user creation 
    if(!createdUser)
    {
        throw new ApiError(500,"Something went wrong bro while registering user")
    }
    //return res else error
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered success")
    )
})

export {registerUser}