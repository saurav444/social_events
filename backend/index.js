const express = require('express');
const app = express();
const connectDb = require('./database/db');
const dotenv = require('dotenv');
dotenv.config();
const userAuthRoute = require('./routes/userAuth');
const userPostRoute = require('./routes/userPostRoute');
const userReviewRoute = require('./routes/usersRoute');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use('/api/user',userAuthRoute);
app.use('/api/users/post',userPostRoute);
app.use('/api/user-review',userReviewRoute);




app.listen(process.env.PORT,()=>{
    connectDb();
    console.log('event project');
});