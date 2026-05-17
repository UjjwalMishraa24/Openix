import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
   const { username, email, password } = req.body;
   console.log("Registering user:", { username, email, password });
    // Here you would typically add logic to save the user to the database
    res.status(200).json({ message: "User registered successfully", user: { username, email } });

// user details validation
if (
    [username, email, password, fullname].some((field) => !field || field.trim() === "")
) {
    throw new ApiError(400, "All fields are required");
}

// user existence check

const existedUser = await User.findOne({ $or: [{ email }, { username }] });
console.log("Existed user:", existedUser);
if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
}
const avatarLocalPath = req.files?.avatar[0]?.path;
const coverPhotoLocalPath = req.files?.coverPhoto[0]?.path;

// avatar validation
if (!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required");
    }

// avatar and cover photo upload to cloudinary 
const avatar = await uploadOnCloudinary(avatarLocalPath);
const coverPhoto = await uploadOnCloudinary(coverPhotoLocalPath);

if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar"); 
}

// if (!coverPhoto) {
//     throw new ApiError(500, "Failed to upload cover photo");
// }\

// new user creation 

const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverPhoto: coverPhoto?.url || "" ,
    username: username.toLowerCase(),
    email,
    password,

}) 

// fetching created user details without password and refresh token
    const createdUser = await User.findById(user._id)
    .select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Failed to create user");
    }

    return res.status(201)
    .json(new ApiResponse(201,"User registered successfully", createdUser));




})
export { registerUser };