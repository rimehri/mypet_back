const {register,signout ,getAnimal,getuserbyphone,verifCode, showalluser,activateAccount,login,forgetPassword,resetPassword,updatePassword,deleteAccount,getUser,updateProfile,addanim,editeanimal,removeanimal} = require ("../functions/User");
const {isAdmin} = require ('../middleware/auth');
const multer = require("multer");
const express = require('express');
const path = require("path");
const router = express.Router();
const storage = multer.diskStorage({
  destination:'././src/public/uploads/animal',
  filename: (req, file, cb) => {
      return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})
const upload= multer({
  storage:storage,
 
});




  

router.post('/register', register);
router.patch('/activateAccount/', activateAccount);
router.post('/login', login);
router.patch('/forgetPassword', forgetPassword);
router.patch('/resetPassword', resetPassword);
router.patch('/updatePassword', updatePassword);
router.delete('/deleteAccount', deleteAccount);
router.get('/getUser/:id', getUser);
router.get('/getUsers', showalluser);
router.patch('/updateProfile', updateProfile);
router.post('/addanim',upload.single('image'),addanim);
router.patch('/editeanimal',editeanimal);
router.delete('/removeanimal',removeanimal);
router.get('/verifCode',verifCode);
router.get('/getuserbyphone',getuserbyphone);
router.get('/getAnimal/',getAnimal);
router.get('/signout',signout);

module.exports = router;