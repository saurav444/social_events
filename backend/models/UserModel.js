const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    number: {
        type: Number,
        required: true,
        unique:true,
        // max:10

      },
      show_number: {
        type: Number,
        enum : [0,1],
        default: 1
    },
    password:{
        type:String,
        required:true
    },
    fullName:{
        type:String,
        // required:true,
    },
    city:{
        type:String,
        required:true,
    },
    pincode:{
        type:Number,
        required:true,
        // max:6
    },
    userType: {
        type: Number,
        enum : [0,1,2],
        default: 0
    },
    fullAddress:{
        type:String,
        default:null
    },
    bio:{
        type:String,
        default:null
    },
    about:{
        type:String,
        default:null
    },
    qualification:{
        type:String,
        default:null
    },
    profilePicture:{
        type:String,
        default:null
    },
    coverPicture:{
        type:String,
        default:null
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    blocks:[{
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

const User = mongoose.model('User',userSchema);

module.exports = User;


