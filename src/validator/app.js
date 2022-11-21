exports.userValidator=(req,res,next)=>{
    //req.check('name','Nnme is Required').notEmpty()
    req.check('email','Email must be between 3 to 32 characters').matches(/.+\@.+\..+/).withMessage('Email must have a validate format ')
    .isLength({
        min:4,
        max:32
    }); 
    req.check('password','Password is required').notEmpty()
    req.check('password').isLength({min:4})
    .withMessage('Password must contain at least 4 characters')
    const errors = req.validationErrors()
    if(errors){
        const firstError = errors.map(error=> error.msg)[0]; 
        return res.status(400).json({error:firstError});
    }
    next(); 

}