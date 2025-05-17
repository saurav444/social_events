const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');
const {signUpValidation,signInValidation} = require('../helper/validation');
const userAuthCheck = require('../middleware/userAuthMiddleware');
const usersController = require('../controllers/usersController');

const multer = require('multer');
const storage= multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'profilePicture') {
            // if uploading cast photo
            cb(null, 'public/users/profile')
          }
        if(file.fieldname === 'backgroundPicture'){
            // else uploading trailer 
            cb(null, 'public/users/profile')
          }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if(file.fieldname === 'profilePicture'||file.fieldname === 'backgroundPicture'){
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|jfif)$/)) {
        return cb(new Error('You can upload only image files!'));
    }
    else{
    cb(null, true);
    }
    }
};


const upload = multer({ storage:storage, fileFilter: fileFilter });








router.post('/register',signUpValidation,userAuthController.registerProcess);
router.post('/login',signInValidation,userAuthController.loginProcess);
router.patch('/update-profile',userAuthCheck,upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'backgroundPicture', maxCount: 1 }
  ]),userAuthController.userProfileUpdate);
router.patch('/follow/:id',userAuthCheck,usersController.followProcess);
router.patch('/unfollow/:id',userAuthCheck,usersController.unFollowProcess);
router.patch('/block/:id',userAuthCheck,userAuthController.userBlockProcess);
router.patch('/unblock/:id',userAuthCheck,userAuthController.userUnblockProcess);
router.get("/get-users", userAuthCheck, userAuthController.getUsers);
router.get("/:userId", userAuthController.getUser);


module.exports = router;
