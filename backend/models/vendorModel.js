const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
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
    image:{
        type:String,
        default:null
    },
    video:{
        type:String,
        default:null
    },
    description:{
        type:String,
        default:null
    },
    status: {
        type: Number,
        enum : [0,1],
        default: 1
    },
    time : { type : Date, default: Date.now }

   
});

const Vendor = mongoose.model('Vendor',vendorSchema);

module.exports = Vendor;


