const User = require('../models/UserModel');
const { validationResult } = require('express-validator');
// const bcrypt = require('bcrypt');

// const dotenv = require('dotenv');
// dotenv.config();
// const SECRET_TOKEN_KEY = "abcde";
// const jwt = require('jsonwebtoken');

const followProcess = async (req,res)=>{
    try{

        const followingId = req.params.id;
        const followerId = req.user.user._id;
        if(followingId == followerId)
        {
            res.status(400).send({success:false,message:'you can not follow yourself'});
        }
        else{

            const isFollowingExists = await User.findOne({$and:[{_id:followerId},{following:followingId}]});
            const isFollowerExists = await User.findOne({$and:[{_id:followingId},{followers:followerId}]});

            if(!isFollowingExists && !isFollowerExists)
            {
                const following = await User.findByIdAndUpdate({ _id:followerId },
                    { $push: { following: followingId } }
                );
                const followed = await User.findByIdAndUpdate({ _id:followingId },
                    { $push: { followers: followerId } }
                );
    
                const user = await User.findById(followerId);
                // console.log(user);
                res.status(200).send({success:true,data:user,message:'followed sucessfully'});
            }
            else
            {
                res.status(400).send({success:false,message:'allreday followed by you.'});
            }

        }
        // console.log();
        // res.status(200).send({success:true,data:req.user,message:'successfully logged in'});
    }catch(error)
    {
        res.status(400).send({success:false,message:error.message});
    }
}

const unFollowProcess = async (req,res)=>{
    try{

        const unFollowingId = req.params.id;
        const unFollowerId = req.user.user._id;
        if(unFollowingId == unFollowerId)
        {
            res.status(400).send({success:false,message:'you can not unfollow yourself'});
        }
        else{

            const isFollowingExists = await User.findOne({$and:[{_id:unFollowerId},{following:unFollowingId}]});
            const isFollowerExists = await User.findOne({$and:[{_id:unFollowingId},{followers:unFollowerId}]});
            // console.log(isFollowingExists);
            // console.log(isFollowerExists);

            if(isFollowingExists && isFollowerExists)
            {
                // console.log('aaaaa');
                const following = await User.findByIdAndUpdate({ _id:unFollowerId },
                    { $pull: { following: unFollowingId } }
                );
                const followed = await User.findByIdAndUpdate({ _id:unFollowingId },
                    { $pull: { followers: unFollowerId } }
                );
    
                const user = await User.findById(unFollowerId);
                // console.log(user);
                res.status(200).send({success:true,data:user,message:'un followed sucessfully'});
            }
            else
            {
                res.status(400).send({success:false,message:'allreday un followed by you, follow him/her first before unfollow'});
            }

        }
        // console.log();
        // res.status(200).send({success:true,data:req.user,message:'successfully logged in'});
    }catch(error)
    {
        res.status(400).send({success:false,message:error.message});
    }
}


// const addPost = async (req,res)=>{
//     try{
//         console.log('ssssss');

//         // let title = req.body.title;
//         // let image = req.body.image;

//         // console.log(title+"    "+image);

//         res.status(200).send({data:req.body});
        
//     }catch(error)
//     {
//         res.status(400).send({success:false,message:error.message});
//     }
// }







module.exports = {
    followProcess,
    unFollowProcess,

}