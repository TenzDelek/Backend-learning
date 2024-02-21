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
    //check if user already exists:username,email
    const existedUser= await User.findOne({
        $or: [{username},{email}] //This query is looking for a user in the User collection where 
        //either the username or the email matches the provided values. It will return the first document that satisfies any of these conditions.
    })
    if(existedUser)
    {
        throw new ApiError(409,"User with that given email or name already exist")
    }
    //check for images, check for avatar
    const avatarlocalpath=req.files?.avatar[0]?.path //files is from multer
    // const coverimagelocalpath=req.files?.coverImage[0]?.path
    let coverimagelocalpath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0)
    {
        coverimagelocalpath=req.files.coverImage[0].path
    }
    
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
    const user=await User.create({
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
const generateAccessAndRefreshTokens=async(userId)=>{
    try {
     const user=  await User.findById(userId)
     const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken
       await user.save({validateBeforeSave:false}) //cause usually we need password to do it

       return {accessToken,refreshToken}
} catch (error) {
        throw new ApiError(500,"something went wrong while genrating refresh and access token")
    }
}

const loginUser=asyncHandler(async(req,res)=>{
    //req body ->data
    const {email,username,password}=req.body
    //username or email
    if(!email || !username){
        throw new ApiError(400,"username or emial is required")
    }
    //find the user
    //the find one return the first query that the mongo find
    const user=await User.findOne({$or:[{username},{email}]})
    //here it doing either from email or username, the or is from mongodb
    if(!user){
        throw new ApiError(404,"user doesnt exist")
    }
    //pasword check
    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"password incorrect ")
    }
    //access and refresh token
   const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)
    
   const loggedInUser=await User.findById(user._id).select('-password -refreshToken')
   //send cookie
    const option={ //making it only modified on server not client
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json(
        new ApiResponse(
            200,{
                user:loggedInUser,accessToken,
                refreshToken
            },
            "user logged in successfully"
        )
    )
})


export {registerUser,loginUser}