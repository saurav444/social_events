const mongoose = require('mongoose');

const userPostSchema = new mongoose.Schema({
    title:{
        type:String,
        default:null
    },
    slug:{
        type:String,
        default:null,
        trim:true,
        lowercase:true
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    image:{
        type:String,
        default:null
    },
    video:{
        type:String,
        default:null
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    status: {
        type: Number,
        enum : [0,1],
        default: 1
    },
    time : { type : Date, default: Date.now }

   
});

const UserPost = mongoose.model('UserPost',userPostSchema);

module.exports = UserPost;


