const mongoose = require('mongoose');

const userPostCommentSchema = new mongoose.Schema({
    comment:{
        type:String,
        required:true,
    },
    postId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserPost',
        required:true,
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required:true,
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    replies:[
        {
            repliesText:{
                type:String,
                required:true,
            },
            userId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User',
                required:true,
            },
            likes:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }],
            time : { type : Date, default: Date.now }
        }
    ],
    status: {
        type: Number,
        enum : [0,1],
        default: 1
    },
    time : { type : Date, default: Date.now }

   
});

const UserPostComment = mongoose.model('PostComment',userPostCommentSchema);

module.exports = UserPostComment;


