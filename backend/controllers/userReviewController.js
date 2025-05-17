const User = require('../models/UserModel');
const { validationResult } = require('express-validator');
const UserReview = require('../models/userReviewModel');
// const bcrypt = require('bcrypt');

// const dotenv = require('dotenv');
// dotenv.config();
// const SECRET_TOKEN_KEY = "abcde";
// const jwt = require('jsonwebtoken');

// const followProcess = async (req,res)=>{
//     try{

//         const followingId = req.params.id;
//         const followerId = req.user.user._id;
//         if(followingId == followerId)
//         {
//             res.status(400).send({success:false,message:'cyou can not follow yourself'});
//         }
//         else{

//             const isFollowingExists = await User.findOne({$and:[{_id:followerId},{following:followingId}]});
//             const isFollowerExists = await User.findOne({$and:[{_id:followingId},{followers:followerId}]});

//             if(!isFollowingExists && !isFollowerExists)
//             {
//                 const following = await User.findByIdAndUpdate({ _id:followerId },
//                     { $push: { following: followingId } }
//                 );
//                 const followed = await User.findByIdAndUpdate({ _id:followingId },
//                     { $push: { followers: followerId } }
//                 );
    
//                 const user = await User.findById(followerId);
//                 // console.log(user);
//                 res.status(200).send({success:true,data:user,message:'followed sucessfully'});
//             }
//             else
//             {
//                 res.status(400).send({success:false,message:'allreday followed by you.'});
//             }

//         }
//         // console.log();
//         // res.status(200).send({success:true,data:req.user,message:'successfully logged in'});
//     }catch(error)
//     {
//         res.status(400).send({success:false,message:error.message});
//     }
// }

// const unFollowProcess = async (req,res)=>{
//     try{

//         const unFollowingId = req.params.id;
//         const unFollowerId = req.user.user._id;
//         if(unFollowingId == unFollowerId)
//         {
//             res.status(400).send({success:false,message:'you can not unfollow yourself'});
//         }
//         else{

//             const isFollowingExists = await User.findOne({$and:[{_id:unFollowerId},{following:unFollowingId}]});
//             const isFollowerExists = await User.findOne({$and:[{_id:unFollowingId},{followers:unFollowerId}]});
//             // console.log(isFollowingExists);
//             // console.log(isFollowerExists);

//             if(isFollowingExists && isFollowerExists)
//             {
//                 // console.log('aaaaa');
//                 const following = await User.findByIdAndUpdate({ _id:unFollowerId },
//                     { $pull: { following: unFollowingId } }
//                 );
//                 const followed = await User.findByIdAndUpdate({ _id:unFollowingId },
//                     { $pull: { followers: unFollowerId } }
//                 );
    
//                 const user = await User.findById(unFollowerId);
//                 // console.log(user);
//                 res.status(200).send({success:true,data:user,message:'un followed sucessfully'});
//             }
//             else
//             {
//                 res.status(400).send({success:false,message:'allreday un followed by you, follow him/her first before unfollow'});
//             }

//         }
//         // console.log();
//         // res.status(200).send({success:true,data:req.user,message:'successfully logged in'});
//     }catch(error)
//     {
//         res.status(400).send({success:false,message:error.message});
//     }
// }


const addReviewProcess = async (req,res)=>{
    try{

        const userId = req.user.user._id;
        const reviewUserId = req.params.id;
        if(userId == reviewUserId)
        {
           return res.status(400).send({success:false,message:'you can not review yourself'});
        }
        const text = req.body.text;
        const ratings = req.body.rating;
        const data = {
            userId:reviewUserId
        }
        const isReviewExists = await UserReview.findOne({userId:reviewUserId});
        if(isReviewExists)
        {
            await UserReview.findByIdAndUpdate({ _id:isReviewExists._id.toString() },
            { $push: { reviews: {userId:userId,text:text,ratings:ratings} } }
            );

            return res.status(200).send({success:false,message:'review added succsssfully'});
        }else{
            const userReview = new UserReview(data);
            await userReview.save();
            if(userReview)
            {
                // console.log(userReview._id.toString());
                // return;
                   await UserReview.findByIdAndUpdate({ _id:userReview._id.toString() },
                        { $push: { reviews: {userId:userId,text:text,ratings:ratings} } }
                    );
    
                    return res.status(200).send({success:false,message:'review added succsssfully'});
    
            }
            else{
                return res.status(400).send({success:false,message:'something went wrong'});
            }
        }


        // console.log(reviewUserId);
        
    }catch(error)
    {
        res.status(400).send({success:false,message:error.message});
    }
}


const deleteReviewProcess = async (req,res)=>{
    try{

        const userId = req.user.user._id;
        const userReviewId = req.params.id;
        const reviewId = req.params.reviewId;

        const isReviewExists = await UserReview.findOne({ _id: userReviewId });
  
        if (isReviewExists) {
          const reviewIndex = isReviewExists.reviews.findIndex(
            (review) => review._id.toString() === reviewId
          );
          
          if (reviewIndex === -1) {
            return res
              .status(400)
              .send({ success: false, message: "Review not found" });
          }

          const reviewIndexs = isReviewExists.reviews.findIndex(
            (review) => review.userId.toString() === userId
          );
          // console.log(reviewIndexs);
          if (reviewIndexs === -1) {
            return res
              .status(400)
              .send({ success: false, message: "You can delete your own reviews only." });
          }


    
          const reviewDelete = await UserReview.findByIdAndUpdate(
            { _id: userReviewId },
            { $pull: { reviews: { _id: reviewId } } }
          );
    
          if (reviewDelete) {
            const noMoreReviews = await UserReview.findOne({ _id: userReviewId });
            console.log(noMoreReviews.reviews.length);
            if(noMoreReviews.reviews.length==0)
            {
              await UserReview.findByIdAndDelete({ _id: userReviewId });
            }
            return res
              .status(200)
              .send({ success: true, message: "Review deleted successfully" });
          } else {
            return res
              .status(400)
              .send({ success: false, message: "Error in deleting the Review" });
          }
        } else {
          return res.status(400).send({ success: false, message: "Review does not exist" });
        }


        // console.log(reviewUserId);
        
    }catch(error)
    {
        res.status(400).send({success:false,message:error.message});
    }
}





module.exports = {
    addReviewProcess,
    deleteReviewProcess

}