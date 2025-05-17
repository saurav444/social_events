const mongoose = require('mongoose');

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL);
        // console.log('database');

    }catch(error)
    {
        console.log('database is not connected'+error);
    }
}



module.exports = connectDB;
