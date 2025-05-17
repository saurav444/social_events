const express = require('express');
const router = express.Router();
const userReviewController = require('../controllers/userReviewController');
// const {reviewValidation} = require('../helper/validation');
const userAuthCheck = require('../middleware/userAuthMiddleware');






router.post('/add-review/:id',userAuthCheck,userReviewController.addReviewProcess);
router.delete('/delete-review/:id/:reviewId',userAuthCheck,userReviewController.deleteReviewProcess);

module.exports = router;
