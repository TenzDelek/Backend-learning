import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend - here only data are handle for file to get handle we do that in userroute with upload(multer)
  const { fullName, email, username, password } = req.body;
  console.log("email:", email);
  //validation - not empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    //here if anyone field got empty it return true which make use easy to find the error(no need for wrting whole if again and again)
    throw new ApiError(400, "All fields are required");
  }
  //check if user already exists:username,email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }], //This query is looking for a user in the User collection where
    //either the username or the email matches the provided values. It will return the first document that satisfies any of these conditions.
  });
  if (existedUser) {
    throw new ApiError(409, "User with that given email or name already exist");
  }
  //check for images, check for avatar
  const avatarlocalpath = req.files?.avatar[0]?.path; //files is from multer
  // const coverimagelocalpath=req.files?.coverImage[0]?.path
  let coverimagelocalpath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverimagelocalpath = req.files.coverImage[0].path;
  }

  if (!avatarlocalpath) {
    throw new ApiError(400, "avatar is required");
  }
  //upload them to cloudinary,avatar check
  const avatar = await uploadoncloudinary(avatarlocalpath);
  const coverImage = await uploadoncloudinary(coverimagelocalpath);
  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }
  //create user objects- create entry in db
  //--User is the one that talks with the database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  //for each entry mongo generate an id
  //remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); // the syntax for select is new- what we do is if we dont want passowrd and token field just write - infront of it

  //check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong bro while registering user");
  }
  //return res else error
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered success"));
});
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //cause usually we need password to do it

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while genrating refresh and access token"
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  //req body ->data
  const { email, username, password } = req.body;
  //username or email
  if (!(email || !username)) {
    throw new ApiError(400, "username or emial is required");
  }
  //find the user
  //the find one return the first query that the mongo find
  const user = await User.findOne({ $or: [{ username }, { email }] });
  //here it doing either from email or username, the or is from mongodb
  if (!user) {
    throw new ApiError(404, "user doesnt exist");
  }
  //pasword check
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "password incorrect ");
  }
  //access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //send cookie
  const option = {
    //making it only modified on server not client
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //here the small user is coming from the middleware name (auth) see the route.js
  await User.findByIdAndUpdate(
    req.user._id, //find by id
    {
      $set: {
        //update
        refreshToken: undefined,
      },
    },
    {
      new: true, //the return res will now get the updated value
    }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "user log out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //first we have to get the cookies to get the access of refresh token
  //here incoming because we have one in database
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthized request: refresh token");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "refresh token is expired or used");
    }

    const option = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", newRefreshToken, option)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id); //from auth middelware
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "current user fetched"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }
  const user =await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName, //both can be written like each other
        email: email,
      },
    },
    { new: true }
  ) //the new true is that the updated value is send
    .select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "account details upddated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is missing");
  }
  const avatar = await uploadoncloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "the url from cloudinary is missing");
  }
  const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");
  return res.status(200).json(new ApiResponse(200,user,"avatar image changed"))
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverLocalPath = req.file?.path;
  if (!coverLocalPath) {
    throw new ApiError(400, "cover file is missing");
  }
  const coverImage = await uploadoncloudinary(coverLocalPath);
  if (!coverImage.url) {
    throw new ApiError(400, "the url from cloudinary is missing");
  }
  const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res.status(200)
  .json(new ApiResponse(200,user,"CoverImage updated!!"))
});

const getUserChannelProfile= asyncHandler(async(req,res)=>{
const{username}=req.params
if(!username?.trim())
{
  throw new ApiError(400,"username is missing from url")
} 
 const channel=await User.aggregate([
  {
    $match:{ //we first match the user
      username:username?.toLowerCase() 
    }
  },
  {
    $lookup:{ //check for how many subscriber he has
        from:"subscriptions", // the model name turns to lowercase and plural like this
        localField:"_id",
        foreignField:"channel",
        as:"subscribers"
    }
  },
  {
    $lookup:{ //check how many channels he has subscribed
      from:"subscriptions",
      localField:"_id",
      foreignField:"subscriber",
      as:"subscribedTo"
    }
  },
  {
    $addFields:{ //adding the field to user
      subscribersCount:{
        $size:"$subscribers"
      },
      channelsSubscribedToCount:{
        $size:"$subscribedTo"
      },
      isSubscribed:{
        $cond:{ //condition
          if:{
            $in:[req.user?._id,"$subscribers.subscriber"] // here the in is like is the user_id is present in the subscriber object
          },
          then:true,
          else:false
        }
      }
    }
  },
  {
    $project:{ //only gives the selected items
      fullName:1,
      username:1,
      subscribersCount:1,
      channelsSubscribedToCount:1,
      isSubscribed:1,
      avatar:1,
      coverImage:1,
      email:1,
    }
  }
 ])
if(!channel?.length)
{
  throw new ApiError(404,"channel does not existed")
}

return res.status(200)
.json(new ApiResponse(200,channel[0],"user channel fetched succesfully"))
})
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile
};
