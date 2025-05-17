const mongoose = require('mongoose');

const userReviewSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    reviews:[
        {
            text:{
                type:String,
                required:true,
            },
            userId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User',
                required:true,
            },
            ratings:{
                type:Number,
                required:true,
                max:1
            },
            time : { type : Date, default: Date.now }
        }
    ],
    time : { type : Date, default: Date.now }

   
});

const UserReview = mongoose.model('UserReview',userReviewSchema);

module.exports = UserReview;


