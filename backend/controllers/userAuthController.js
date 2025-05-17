const User = require('../models/UserModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const dotenv = require('dotenv');
dotenv.config();
const SECRET_TOKEN_KEY = "abcde";
const jwt = require('jsonwebtoken');


// const registerPage = async(req,res)=>{

// }
const registerProcess = async(req,res)=>{
    // res.send('hello ji');
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors:errors.array()})
        }else{
            const email = req.body.email;
            const number = req.body.number;
            const isEmailExists = await User.findOne({email:email});
            const isUsernameExists = await User.findOne({username:req.body.username});
            const isMobileExists = await User.findOne({number:number});
            // console.log(isEmailExists);
            // return;
            if(isUsernameExists)
            {
                return res.status(409).send({success:true,message:'this username is allready registered'});
            }
            else if(isEmailExists)
            {
                return res.status(409).send({success:true,message:'this email is allready registered'});
            }
            else if(isMobileExists)
            {
                return res.status(409).send({success:true,message:'this mobile number is allready registered'});
            }
            else{
                
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hashSync(req.body.password,salt);
            const data = {
                username:req.body.username,
                email:email,
                number:number,
                password:hashedPassword,
                city:req.body.city,
                pincode:req.body.pincode
            }
            // console.log(data);
            // return;

            const user = new User(data);
            await user.save();
            return res.status(200).send({success:true,message:'User registered successfully...'});
            }
        }
    }catch(error)
    {
        return res.status(400).send({success:false,message:error.message});
    }

}


const loginProcess = async (req,res)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors:errors.array()});
        }else{
            const isMobileExists = await User.findOne({number:req.body.number});
            if(isMobileExists)
            {
                const passwordMatch = await bcrypt.compare(req.body.password,isMobileExists.password);
                if(!passwordMatch)
                {
                    return res.status(401).send({success:true,message:'Password mismatch'});
                }else{
                    const token = jwt.sign({user:isMobileExists},SECRET_TOKEN_KEY,{expiresIn:"50 min"});
                        if(token)
                        {
                            // console.log(req.user);
                            return res.status(200).send({success:true,token:token,data:isMobileExists,message:'successfully logged in'});
                        }else{
                            return res.status(400).send({success:false,message:'no token, please login'});
                        }
                }
            }else{
                return res.status(400).send({success:false,message:'this mobile number is not registered'});
            }
            
        }
    }catch(error)
    {
        return res.status(400).send({success:false,message:error.message});
    }
}

const userProfileUpdate = async (req,res)=>{
    try{
        // console.log(req.user.user._id);
        // return;
        const userId = req.user.user._id;

        const updates = { ...req.body };

        if (req.files['profilePicture']) {
            updates.profilePicture = req.files['profilePicture'][0].path.replace("public\\", "");
           
          }
        if (req.files['backgroundPicture']) {
            updates.coverPicture = req.files['backgroundPicture'][0].path.replace("public\\", "");
          }
        //   console.log(updates.coverPicture);
        //   return;

          const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
       
          if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
          }else{
            return res.status(200).json({ success:true,data:updatedUser,message: "User upadted sucessfully" });
          }

    }catch(error)
    {
        return res.status(400).send({success:false,message:error.message});
    }
}


const userBlockProcess = async (req,res)=>{
    try{

        const blockingId = req.params.id;
        const userId = req.user.user._id;
        if(blockingId == userId)
        {
            return res.status(400).send({success:false,message:'you can not block yourself'});
        }
        else{

            const blockingUser = await User.findById(blockingId);
            if(!blockingUser)
            {
                return res.status(400).send({success:false,message:'This user is not exists'});
            }
            const isBlocksExists = await User.findOne({$and:[{_id:userId},{blocks:blockingId}]});
            if(isBlocksExists)
            {
                return res.status(400).send({success:false,message:'you have allreday blocked the user'});
            }
            else
            {
                await User.findByIdAndUpdate({ _id:userId },
                    { $push: { blocks: blockingId } }
                );

                return res.status(200).send({success:true,message:'user blocked sucessfully'});
            }

        }
    }catch(error)
    {
       return res.status(400).send({success:false,message:error.message});
    }
}

const userUnblockProcess = async (req,res)=>{
    try{

        const blockingId = req.params.id;
        const userId = req.user.user._id;
        if(blockingId == userId)
        {
            return res.status(400).send({success:false,message:'you can not unblock yourself'});
        }
        else{

            const blockingUser = await User.findById(blockingId);
            if(!blockingUser)
            {
                return res.status(400).send({success:false,message:'This user is not exists'});
            }
            const isBlocksExists = await User.findOne({$and:[{_id:userId},{blocks:blockingId}]});
            if(!isBlocksExists)
            {
                return res.status(400).send({success:false,message:'you have allreday unblocked the user'});
            }
            else
            {
                await User.findByIdAndUpdate({ _id:userId },
                    { $pull: { blocks: blockingId } }
                );

                return res.status(200).send({success:true,message:'user unblocked sucessfully'});
            }

        }
    }catch(error)
    {
       return res.status(400).send({success:false,message:error.message});
    }
}

const getUsers = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
  
      const sortDirection = req.query.sort === "asc" ? 1 : -1;
  
      const users = await User.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      res.status(200).json({
        users
      });
    } catch (error) {
      next(error);
    }
  };

  const getUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.userId);
  
      if (!user) {
        return next(errorHandler(404, "User not found"));
      }
  
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };





module.exports = {
    registerProcess,
    loginProcess,
    userBlockProcess,
    userUnblockProcess,
    getUsers,
    getUser,
    userProfileUpdate
    // registerPage

}