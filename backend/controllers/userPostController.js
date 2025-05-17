const UserPost = require('../models/userPostModel');
const PostComment = require('../models/postCommentModel');



const addPost = async (req,res)=>{
    try{

        let title = req.body.title;
        let image;

        if(title==undefined && !req.body.file)
        {
            return res.status(400).send({success:false,message:"please write something or upload a file"});
        }else{    
            if(!title)
            {
                title = null;
            }
            if(!req.body.file)
            {
                 image = null;
            }else{
                image = req.body.file.filename;
            }
            const data = {
                title:title,
                image:image,
                userId:req.user.user._id
            }

            const userPost = new UserPost(data);
            await userPost.save();
            return res.status(200).send({success:true,message:'Post uploaded successfully...'});
        }
        
    }catch(error)
    {
        res.status(400).send({success:false,message:error.message});
    }
}


const postLike = async (req,res)=>{
    try{

        const postId = req.params.id;
        const userId = req.user.user._id;
        // console.log(userId);
        // return;
        const isPostExists = await UserPost.findOne({_id:postId});
        // console.log(isPostExists);
        // return;
        if(isPostExists)
        {
            const isLikeExists = await UserPost.findOne({$and:[{_id:postId},{likes:userId}]});
            if(isLikeExists)
            {
                return res.status(400).send({success:false,message:"You have allreday liked the post"});
            }else{
                const postLike = await UserPost.findByIdAndUpdate({ _id:isPostExists._id },
                    { $push: { likes: userId } }
                );
                if(postLike)
                {
                    return res.status(200).send({success:true,message:"post liked succsesssfully"});
                }else{
                    return res.status(400).send({success:false,message:"post like failed due to error"});
                }
            }


        }else{
            return res.status(400).send({success:false,message:"this post is not exists"});
        }
        
        
    }catch(error)
    {
        return res.status(400).send({success:false,message:error.message});
    }
}


const postUnlike = async (req,res)=>{
    try{
        // console.log('sssssss');
        // console.log(req.params.id);

        const postId = req.params.id;
        const userId = req.user.user._id;
        // console.log(userId);
        // return;
        const isPostExists = await UserPost.findOne({_id:postId});
        // console.log(isPostExists);
        if(isPostExists)
        {
            const isUnLikeExists = await UserPost.findOne({$and:[{_id:postId},{likes:userId}]});
            if(isUnLikeExists)
            {
                const postunlike = await UserPost.findByIdAndUpdate({ _id:postId },
                    { $pull: { likes: userId } }
                );
                if(postunlike)
                {
                    return res.status(200).send({success:true,message:"post unliked succsesssfully"});
                }else{
                    return res.status(400).send({success:false,message:"post unlike failed due to error"});
                }


                
            }else{
                return res.status(400).send({success:false,message:"Please like first before unlike"});
            }


        }else{
            return res.status(400).send({success:false,message:"this post is not exists"});
        }
        
        
    }catch(error)
    {
        return res.status(400).send({success:false,message:error.message});
    }
}


const postEdit = async (req,res)=>{
    try{

        let title = req.body.title;
        let image;
        const postId = req.params.id;
        const userId = req.user.user._id;
        const isPostExists = await UserPost.findOne({_id:postId});
        if(isPostExists)
        {
            if(title==undefined && !req.body.file)
            {
                return res.status(400).send({success:false,message:"please write something or upload a file to update the post"});
            }
            else
            {
                if(!title)
                {
                    title = null;
                }
                if(!req.body.file)
                {
                        image = null;
                }else{
                    image = req.body.file.filename;
                }
                const data = {
                    title:title,
                    image:image,
                }
            }        

            const updatedPost = await UserPost.findByIdAndUpdate(
                postId,
                { title,image },
                { new: true, upsert: true }
              );


            return res.status(200).send({success:true,data:updatedPost,message:"post updated sucessfully"});
        }
        else
        {
            return res.status(400).send({success:false,message:"this post is not exists"});
        }

        
    }catch(error)
    {
        return res.status(400).send({success:false,message:error.message});
    }
}

const postDelete = async (req,res)=>{
    try{

        const postId = req.params.id;
        const isPostExists = await UserPost.findOne({_id:postId});
        if(isPostExists)
        {

            const deletedpost = await UserPost.findByIdAndDelete(postId);
            if(deletedpost)
            {
                return res.status(200).send({success:true,message:"post deleted sucessfully"});
            }else{
                return res.status(400).send({success:true,message:"problem is occuring during delete the post"});
            }
           
        }
        else
        {
            return res.status(400).send({success:false,message:"this post is not exists"});
        }

        
    }catch(error)
    {
        return res.status(400).send({success:false,message:error.message});
    }
}

const addComment = async (req,res)=>{
    try{

        const postId = req.params.id;
        const isPostExists = await UserPost.findOne({_id:postId});
        if(isPostExists)
        {
            const userId = req.user.user._id;

            const data = {
                comment:req.body.comment,
                userId:userId,
                postId:postId
            }

            const userPostComment = new PostComment(data);
            await userPostComment.save();
            return res.status(200).send({success:true,message:'Comment added successfully...'});
           
        }
        else
        {
            return res.status(400).send({success:false,message:"this post is not exists"});
        }

        
    }catch(error)
    {
        return res.status(400).send({success:false,message:error.message});
    }
}


const editComment = async (req,res)=>{
    try{

        // return res.status(200).send({success:true,data:req.params.id,data2:req.params.comment_id});

        const postId = req.params.id;
        const commentId = req.params.comment_id;
        const isPostExists = await UserPost.findOne({_id:postId});
        if(isPostExists)
        {
            const isCommentExists = await PostComment.findOne({$and:[{_id:commentId},{postId:postId}]});
            if(isCommentExists)
            {
                const comment = req.body.comment;
                const updatedPostComment = await PostComment.findByIdAndUpdate(
                    commentId,
                    { comment }
                  );
            }
            else
            {
                return res.status(400).send({success:false,message:"this comment is not exists"});
            }


            return res.status(200).send({success:true,message:"comment updated sucessfully"});

        }
        else
        {
            return res.status(400).send({success:false,message:"this post is not exists"});
        }

        
    }catch(error)
    {
        return res.status(400).send({success:false,message:error.message});
    }
}


const deleteComment = async (req,res)=>{
    try{

        // return res.status(200).send({success:true,data:req.params.id,data2:req.params.comment_id});

        const postId = req.params.id;
        const commentId = req.params.comment_id;
        const isPostExists = await UserPost.findOne({_id:postId});
        if(isPostExists)
        {
            const isCommentExists = await PostComment.findOne({$and:[{_id:commentId},{postId:postId}]});
            if(isCommentExists)
            {
                const comment = req.body.comment;
                await PostComment.findByIdAndDelete(commentId);
            }
            else
            {
                return res.status(400).send({success:false,message:"this comment is not exists"});
            }


            return res.status(200).send({success:true,message:"comment deleted sucessfully"});

        }
        else
        {
            return res.status(400).send({success:false,message:"this post is not exists"});
        }

        
    }catch(error)
    {
        return res.status(400).send({success:false,message:error.message});
    }
}


const commentLike = async (req,res)=>{
    try{

        // return res.status(200).send({success:true,data:req.params.id,data2:req.params.comment_id});

        const postId = req.params.id;
        const commentId = req.params.comment_id;
        const userId = req.user.user._id;

        const isPostExists = await UserPost.findOne({_id:postId});
        if(isPostExists)
        {
            const isCommentExists = await PostComment.findOne({$and:[{_id:commentId},{postId:postId}]});
            if(isCommentExists)
            {
                const isLikeExists = await PostComment.findOne({$and:[{_id:commentId},{likes:userId}]});
                if(!isLikeExists)
                {
                    const commentLike = await PostComment.findByIdAndUpdate({ _id:commentId },
                        { $push: { likes: userId } }
                    );

                }else{
                    return res.status(400).send({success:false,message:"you have allready liked the comment"});
                }
            }
            else
            {
                return res.status(400).send({success:false,message:"this comment is not exists"});
            }


            return res.status(200).send({success:true,message:"comment liked sucessfully"});

        }
        else
        {
            return res.status(400).send({success:false,message:"this post is not exists"});
        }

        
    }catch(error)
    {
        return res.status(400).send({success:false,message:error.message});
    }
}

const commentUnlike = async (req,res)=>{
    try{

        // return res.status(200).send({success:true,data:req.params.id,data2:req.params.comment_id});

        const postId = req.params.id;
        const commentId = req.params.comment_id;
        const userId = req.user.user._id;

        const isPostExists = await UserPost.findOne({_id:postId});
        if(isPostExists)
        {
            const isCommentExists = await PostComment.findOne({$and:[{_id:commentId},{postId:postId}]});
            if(isCommentExists)
            {
                const isLikeExists = await PostComment.findOne({$and:[{_id:commentId},{likes:userId}]});
                if(isLikeExists)
                {

                    const postunlike = await PostComment.findByIdAndUpdate({ _id:commentId },
                        { $pull: { likes: userId } }
                    );

                }else{
                    return res.status(400).send({success:false,message:"you have to like the comment first before unlike the comment"});
                }
            }
            else
            {
                return res.status(400).send({success:false,message:"this comment is not exists"});
            }


            return res.status(200).send({success:true,message:"comment unliked sucessfully"});

        }
        else
        {
            return res.status(400).send({success:false,message:"this post is not exists"});
        }

        
    }catch(error)
    {
        return res.status(400).send({success:false,message:error.message});
    }
}

const addReply = async (req,res)=>{
    try{

        // return res.status(200).send({success:true,data:req.params.id,data2:req.params.comment_id});

        const postId = req.params.id;
        const commentId = req.params.comment_id;
        const userId = req.user.user._id;

        const isPostExists = await UserPost.findOne({_id:postId});
        if(isPostExists)
        {
            const isCommentExists = await PostComment.findOne({$and:[{_id:commentId},{postId:postId}]});
            if(isCommentExists)
            {
                const data = {
                    repliesText:req.body.comment,
                    userId:userId,
                }

                await PostComment.findByIdAndUpdate({ _id:commentId },
                    { $push: { replies: data } }
                );
                return res.status(200).send({success:true,message:'Peply added successfully...'});
            }
            else
            {
                return res.status(400).send({success:false,message:"this comment is not exists"});
            }

        }
        else
        {
            return res.status(400).send({success:false,message:"this post is not exists"});
        }

        
    }catch(error)
    {
        return res.status(400).send({success:false,message:error.message});
    }
}

const editReply = async (req,res)=>{
    try{

        // return res.status(200).send({success:true,data:req.params.id,data2:req.params.comment_id});

        const replyId = req.params.reply_id;
        const commentId = req.params.comment_id;
        const userId = req.user.user._id;

        const isCommentExists = await PostComment.findOne({_id:commentId});
        if(isCommentExists)
        {
            const replyIndex = isCommentExists.replies.findIndex((reply)=>reply._id.toString()===replyId);
            if(replyIndex===-1)
            {
                return res.status(400).send({success:false,message:"reply not founds"});
            }
            else
            {
                isCommentExists.replies[replyIndex].repliesText = req.body.comment;
                await isCommentExists.save();
                return res.status(200).send({success:true,message:"reply updated successfully"});
            }

        }
        else
        {
            return res.status(400).send({success:false,message:"this comment is not exists"});
        }

        
    }catch(error)
    {
        return res.status(400).send({success:false,message:error.message});
    }
}



const deleteReply = async (req, res) => {
    try {
      const replyId = req.params.reply_id;
      const commentId = req.params.comment_id;
  
      const isCommentExists = await PostComment.findOne({ _id: commentId });
  
      if (isCommentExists) {
        const replyIndex = isCommentExists.replies.findIndex(
          (reply) => reply._id.toString() === replyId
        );
        
        if (replyIndex === -1) {
          return res
            .status(400)
            .send({ success: false, message: "Reply not found" });
        }
  
        const replyDelete = await PostComment.findByIdAndUpdate(
          { _id: commentId },
          { $pull: { replies: { _id: replyId } } }
        );
  
        if (replyDelete) {
          return res
            .status(200)
            .send({ success: true, message: "Reply deleted successfully" });
        } else {
          return res
            .status(400)
            .send({ success: false, message: "Error deleting the reply" });
        }
      } else {
        return res.status(400).send({ success: false, message: "Comment does not exist" });
      }
    } catch (error) {
      return res.status(400).send({ success: false, message: error.message });
    }
  };
  

  const replyLike = async (req, res) => {
    try {
      const replyId = req.params.reply_id;
      const commentId = req.params.comment_id;
      const userId = req.user.user._id;
  
      const isCommentExists = await PostComment.findOne({ _id: commentId });
  
      if (isCommentExists) {
        const replyIndex = isCommentExists.replies.findIndex(
          (reply) => reply._id.toString() === replyId
        );
  
        if (replyIndex === -1) {
          return res.status(400).send({ success: false, message: "Reply not found" });
        }
  
        // Check if the user has already liked this reply
        const isAlreadyLiked = isCommentExists.replies[replyIndex].likes.includes(userId);
        if (isAlreadyLiked) {
          return res.status(400).send({ success: false, message: "You have already liked this reply" });
        }
  
        // Add the user's ID to the likes array of the specific reply
        const replyLike = await PostComment.updateOne(
          { _id: commentId, "replies._id": replyId },
          { $push: { "replies.$.likes": userId } }
        );
  
        return res.status(200).send({ success: true, message: "Reply liked successfully" });
      } else {
        return res.status(400).send({ success: false, message: "Comment does not exist" });
      }
    } catch (error) {
      return res.status(400).send({ success: false, message: error.message });
    }
  };


  const replyUnlike = async (req, res) => {
    try {
      const replyId = req.params.reply_id;
      const commentId = req.params.comment_id;
      const userId = req.user.user._id;
  
      // Check if the comment exists
      const isCommentExists = await PostComment.findOne({ _id: commentId });
  
      if (!isCommentExists) {
        return res.status(400).send({ success: false, message: "Comment does not exist" });
      }
  
      // Find the index of the reply in the replies array
      const replyIndex = isCommentExists.replies.findIndex(
        (reply) => reply._id.toString() === replyId
      );
  
      if (replyIndex === -1) {
        return res.status(400).send({ success: false, message: "Reply not found" });
      }
  
      // Check if the user has already liked this reply
      const isAlreadyLiked = isCommentExists.replies[replyIndex].likes.includes(userId);
      
      if (!isAlreadyLiked) {
        return res.status(400).send({ success: false, message: "You need to like this reply before unliking it" });
      }
  
      // If already liked, remove the user's ID from the likes array
      const replyUnlike = await PostComment.updateOne(
        { _id: commentId, "replies._id": replyId },
        { $pull: { "replies.$.likes": userId } }
      );
  
      return res.status(200).send({ success: true, message: "Reply unliked successfully" });
      
    } catch (error) {
      return res.status(400).send({ success: false, message: error.message });
    }
  };

  const getPosts = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
  
      const sortDirection = req.query.order === "asc" ? 1 : -1;
  
      const posts = await UserPost.find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      res.status(200).json({
        posts
      });
    } catch (error) {
      next(error);
    }
  };

  const getPostComments = async (req, res, next) => {
    try {
      const comments = await PostComment.find({
        postId: req.params.postId,
      }).sort({ createdAt: -1 });
  
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };

  const getComments = async (req, res, next) => {
    try {
      $userId = req.user._id;
  
      const startIndex = parseInt(req.query.startIndex) || 0;
  
      const limit = parseInt(req.query.limit) || 9;
  
      const sortDirection = req.query.sort === "desc" ? -1 : 1;
  
      const comments = await PostComment.find({
            userId: req.params.userId,
        })
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      res
        .status(200)
        .json({ comments });
    } catch (error) {
      next(error);
    }
  };
  
  







module.exports = {
    addPost,
    postLike,
    postUnlike,
    postEdit,
    postDelete,
    addComment,
    editComment,
    deleteComment,
    commentLike,
    commentUnlike,
    addReply,
    editReply,
    deleteReply,
    replyLike,
    replyUnlike,
    getPosts,
    getPostComments,
    getComments
}