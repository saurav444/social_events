const { check } = require('express-validator');
exports.signUpValidation = [
    check('username','Username is required').not().isEmpty(),
    check('email','E-mail is required').
    isEmail().normalizeEmail({gmail_remove_dots:true}),
    check('number','Mobile number is required').isLength({
        min:10,
        // max:11
    }),
    check('password','Password is required').not().isEmpty(),
    check('city','Enter your city').not().isEmpty(),
    check('pincode','Pincode is required').isLength({
        max:6
    }),

    

]


exports.signInValidation = [
    check('number','Mobile number is required').not().isEmpty().isLength({
        min:10,
    }),
    check('password','Password is required').not().isEmpty()
]


// exports.reviewValidation = [
//     check('ratings','maximum 5 stars can be given').not().isEmpty().isLength({
//         max:1,
//     }),
// ]