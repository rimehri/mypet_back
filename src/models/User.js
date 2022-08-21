const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
 
    Name: {type: String, require: true},
     gender: {type: String, require: false,},
    
    address: {type:String , rquire :false},
  
    phone: {type: Number},
    email: {type: String, require: true, unique: true, lowercase: true},
    password: {type: String, require: true},
    image: {type: String, default: "avatar.jpeg"},
    resetCode :{type:Number,require: false},
    isActive: {type: Boolean, default: false},
   


});

module.exports = mongoose.model('User', userSchema);