const express = require('express');
const router = express.Router();
const path = require('path');
const userAuthController = require('../controllers/userAuthController');
const {postAddValidation} = require('../helper/userPostValidation');
const userAuthCheck = require('../middleware/userAuthMiddleware');
const usersController = require('../controllers/usersController');
const userPostController = require('../controllers/userPostController');
var multer = require('multer');
// Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, 'public')));

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Set the destination to the 'uploads' folder inside 'public'
    //   cb(null, path.join(__dirname, 'public', 'users/postImages'));
    cb(null, 'public/users/postImages/');
    },
    filename: function (req, file, cb) {
      // Set the file name as the original name or use a custom name
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });






router.post('/add-post',userAuthCheck,upload.single('image'),userPostController.addPost);
router.patch('/like/:id',userAuthCheck,userPostController.postLike);
router.patch('/unlike/:id',userAuthCheck,userPostController.postUnlike);
router.patch('/edit/:id',userAuthCheck,upload.single('image'),userPostController.postEdit);
router.delete('/delete/:id',userAuthCheck,userPostController.postDelete);
router.get("/get-posts", userPostController.getPosts);
router.get("/get-post-comments/:postId", userPostController.getPostComments);

router.post('/comment/:id',userAuthCheck,userPostController.addComment); // post id is send 
router.patch('/edit-comment/:id/:comment_id',userAuthCheck,userPostController.editComment);// post id and comment id is send
router.delete('/delete-comment/:id/:comment_id',userAuthCheck,userPostController.deleteComment);// post id and comment id is send 
router.patch('/comment-like/:id/:comment_id',userAuthCheck,userPostController.commentLike);
router.patch('/comment-unlike/:id/:comment_id',userAuthCheck,userPostController.commentUnlike);
router.patch('/add-reply/:id/:comment_id',userAuthCheck,userPostController.addReply);// post id and comment id is send 
router.put('/edit-reply/:comment_id/:reply_id',userAuthCheck,userPostController.editReply);//comment id & reply id is send 
router.delete('/delete-reply/:comment_id/:reply_id',userAuthCheck,userPostController.deleteReply);
router.patch('/reply-like/:comment_id/:reply_id',userAuthCheck,userPostController.replyLike);
router.patch('/reply-unlike/:comment_id/:reply_id',userAuthCheck,userPostController.replyUnlike);
router.get("/get-comments", userAuthCheck, userPostController.getComments);

module.exports = router;
