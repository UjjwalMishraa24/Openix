import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
    
    {
        userName: {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true
        },
        email: {
                        type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            
        },
        fullName: {
            type : String,
            required : true,
            trim : true,
            index : true,
        },
        avatar: {
            type : String, // cloudinary URL
            trim : true, // clodinary URL


    },
    coverImage: {
        type : String, // cloudinary URL
      
    },
    password: {
        type : String,
        required : [true, "Password is required"],
    },
    watchHistory: {
        type : Schema.Types.ObjectId,
        ref : 'Video',
    },
    refreshToken: {
        type : String,
    },
},
{
    timestamps : true,
}
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}; 
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ userId: this._id,
            userName: this.userName,
                email: this.email,
                    fullName: this.fullName,
                    
     },
         process.env.ACCESS_TOKEN_SECRET, 
         { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
}
    













export const User = mongoose.model('User', userSchema);