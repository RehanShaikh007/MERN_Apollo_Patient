import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";

import {generateToken} from "../utils/jwtToken.js"
import  cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async(req, res, next)=>{
    const {
        firstName, 
        lastName, 
        email, 
        phone, 
        password, 
        gender, 
        dob, 
        aadhar, 
        role
    } = req.body;
    
    if(!firstName || !lastName || !email || !phone || !password ||!gender || !dob ||  !aadhar || !role ) {
      return next(new Errorhandler("Please Fill Full Form!", 400));
    }

    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new Errorhandler("User Already Registered!", 400));
    }
   const user = await User.create({
        firstName, 
        lastName, 
        email, 
        phone, 
        password, 
        gender, 
        dob, 
        aadhar, 
        role,
    });
    generateToken(user, "user Registered!", 200, res);

});

export const login = catchAsyncErrors(async(req, res, next) => {
   const {email, password, confirmPassword, role} = req.body;
   
   if(!email || !password || !confirmPassword || !role){
    return next(new Errorhandler("Please Provide All Details!", 400));
   }

   if(password !== confirmPassword){
    return next(new Errorhandler("Password & ConfrmPasword didn't Match!", 400));

   }

   const user = await User.findOne({email}).select("+password");
   if(!user){
    return next(new Errorhandler("Invalid Password or Email!", 400));

   }

   const isPasswordMatched = await user.comparePassword(password);

   if(!isPasswordMatched){
    return next(new Errorhandler("Invalid Password or Email!", 400));

   }

   if(role !== user.role){
    return next(new Errorhandler("User with this Role Not Found!", 400));

   }

   generateToken(user, "user Login Successfully!", 200, res);

    
});


export const addNewAdmin = catchAsyncErrors(async(req, res, next) => {
    const {
        firstName, 
        lastName, 
        email, 
        phone, 
        password, 
        gender, 
        dob, 
        aadhar, 
    } = req.body;

    if(!firstName || !lastName || !email || !phone || !password ||!gender || !dob ||  !aadhar ) {
        return next(new Errorhandler("Please Fill Full Form!", 400));
      }

      const isRegistered = await User.findOne({email});
      if(isRegistered){
        return next(new Errorhandler(`${isRegistered.role} with this Email Already Exists!`));
      }

      const admin = await User.create({
        firstName, 
        lastName, 
        email, 
        phone, 
        password, 
        gender, 
        dob, 
        aadhar,
        role: "Admin",
    });

    res.status(200).json({
        success: true,
        message: "New Admin Registered!",
    });
});


export const getAllDoctors = catchAsyncErrors(async(req,res,next)=>{
     const doctors = await User.find({role: "Doctor"});
     res.status(200).json({
        success: true,
        doctors
     })
});


export const getUserDetails = catchAsyncErrors (async(req,res,next)=>{
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const logoutAdmin = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "Admin Logout Successfully!",
    });
});

export const logoutPatient = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("patientToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "Patient Logout Successfully!",
    });
});

export const addNewDoctor = catchAsyncErrors(async(req,res,next)=>{
   
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new Errorhandler("Doctor Avatar Required!", 400));
    }
    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if(!allowedFormats.includes(docAvatar.mimetype)){
       return next(new Errorhandler("File Format not Supported!", 400));
    }
    const {
        firstName, 
        lastName, 
        email, 
        phone, 
        password, 
        gender, 
        dob, 
        aadhar,
        doctorDepartment
    } = req.body;

    if(
        (
        !firstName ||
        !lastName || 
        !email || 
        !phone || 
        !password || 
        !gender || 
        !dob || 
        !aadhar ||
        !doctorDepartment ||
        !docAvatar
        )
    ){
        return next(new Errorhandler("Please Provide full Details!", 400));
    }

    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new Errorhandler(`${isRegistered.role} Already Registered with this Email!`, 400));

    }

    const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
  

    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary Error!");
        return next(
            new Errorhandler("Failed To Upload Doctor Avatar To Cloudinary", 500));
        
    }
 

    const doctor = await User.create({
        firstName, 
        lastName, 
        email, 
        phone, 
        password, 
        gender, 
        dob, 
        aadhar,
        doctorDepartment,
        role: "Doctor",
        docAvatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    res.status(200).json({
        success: true,
        message: "New Doctor Registered!",
        doctor
    });
});