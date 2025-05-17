const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const SECRET_TOKEN_KEY = "abcde";


const validateToken = async (req,res,next)=>{
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if(authHeader && authHeader.startsWith('Bearer'))
    {
        token = authHeader.split(' ')[1];
        if(token)
        {
            // console.log('sssssss');
            const decode = jwt.verify(token,SECRET_TOKEN_KEY);
            if(decode)
            {
                req.user = decode;
                return next();
            }else{
                return res.status(400).send({success:false,message:'no token, please login'});
            }

        }else{
            return res.status(400).send({success:false,message:'no token, please login'});
        }

    }
    else{
        return res.status(400).send({success:false,message:'please login first'});
    }
    
}


module.exports = validateToken;