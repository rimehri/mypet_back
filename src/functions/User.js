const bcrypt = require('bcrypt');
const { JWT_SECRET } = require("../config/keys");
const jwt = require('jsonwebtoken') // to generate signed token 
const express = require('express');
const fs = require('fs');
const router = express.Router();
const mailer = require('nodemailer');
const mongoose = require('mongoose');
const expressJwt = require("express-jwt"); // for authorization check 
const User = require('../models/User');
const ejs = require('ejs');  
const path = require("path");
require('dotenv').config();
const { loggers } = require('winston');
const { ObjectId } = require('mongodb');
var sid = process.env.sid ; 
var auth_token = process.env.auth_token ;
const twilio = require('twilio')(sid,auth_token);
const sendsms= (phone,message)=>{
    twilio.messages.create({
from:'+12243282744',
to  :'+216'+phone,
body:message

}).then((res)=>logger.info("message has sent!")).catch((err)=>{
    logger.error(err)
})}

/** config **/
const transporter = mailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: 'rimeh.berrichi@esprit.tn',
        pass: '21180136rimeh'
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    },
});
/** Auth functions **/
exports.register = async (req, res) => {
    const PhoneExist = await User.findOne({ phone: req.body.phone });
    const EmailExist = await User.findOne({ email: req.body.email });
    if (PhoneExist ||  EmailExist)  {
        return res.status(400).json({ message: 'Phone exist or email existe' });
    }
    const resetCode = Math.floor(1000+Math.random() * 9000);
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        Name: req.body.Name,
        phone:req.body.phone,
        addresse:req.body.addresse,
        gender: req.body.gender,
        rolename: req.body.rolename,
         
        
    
        resetCode: resetCode
    });
    const newUser = await user.save();
    newUser.password= undefined; 
    if (newUser) {
      /* let mailOptions = {
            from: 'rimeh.berrichi@esprit.tn',
            to: req.body.email,
            subject: 'Verify your Account',
            text: 'Here is your verification code: ' + resetCode
        };*/
        sendsms(req.body.phone,'Here is your verification code: ' + resetCode); 
      
        return res.status(201).json(newUser);
    
    }
   
        
        
    
    
};
exports.showalluser = (req, res,next) =>{
    User.find().exec().then(user => {
        console.log(user);
        res.status(200).json(user);
        return next();
    }).catch(error => {
        console.log(error);
        res.status(error.code).json({error: error});
    });
};
exports.showallanimal = (req, res,next) =>{
    Animal.find().exec().then(animal => {
        console.log(animal);
        res.status(200).json(animal);
        return next();
    }).catch(error => {
        console.log(error);
        res.status(error.code).json({error: error});
    });
};
function sendmail(mailOptions) {
    transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
exports.activateAccount = async (req, res) => {
    const code = req.body.code;
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) {
        return res.status(400).json({ message: 'phone does not exist' });
    }
    if (user.resetCode === code) {
        User.findOneAndUpdate({ phone: req.body.phone }, { $set: { isActive: true } }, function (error, user) {
            if (error) {
                return res.status(error.code).json(error);
            }
            return res.status(200).json(user);
        });
    } else {
        return res.status(400).json({ message: "Invalid verification code" });
    }
};
exports.verifCode = async (req, res) => {
    const code = req.body.code;
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) {
        return res.status(400).json({ message: 'phone does not exist' });
    }
    if (user.resetCode === code) {
     {
            
            return res.status(200).json({ message: "Code Succ" });
        }
    }
    else {
        return res.status(400).json({ message: "Invalid verification code" });
    }
};
exports.login = async (req, res) => {
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) {
        return res.status(400).json({ message: 'phone does not exist' });
    }
    const verifyPassword = await bcrypt.compare(req.body.password, user.password);
    if (!verifyPassword) {
        return res.status(400).send({ message: 'Password is invalid' });
    }
    if (!user.isActive) {
        return res.status(400).send({ message: 'Account is disabled' });
    }
    if(user){
        // if user is found generate a signed token with user id and secret
        let token = jwt.sign({_id:user._id,rolename:user.rolename},JWT_SECRET);
        const encode = jwt.verify(token, JWT_SECRET);
        res.cookie("t",token,{expire:new Date()+9999}); 
        user.password= undefined;
        return  res.status(200).json({token:token, user:encode,user});
    }
    return res.status(400).json({ message: 'somthing failed' });
};
exports.forgetPassword = async (req, res) => {
    const phoneExist = await User.findOne({ phone: req.body.phone });
    if (!phoneExist) {
        return res.status(400).json({ message: 'phone does not exist' });
    }
    const resetCode = Math.floor(Math.random() * 9999);
    User.findOneAndUpdate({ phone: req.body.phone }, { $set: { resetCode: resetCode } }, function (error, user) {
        if (error) {
            return res.status(error.code).json(error);
        }
        /*let mailOptions = {
            from: 'rimeh.berrichi@esprit.tn',
            to: req.body.email,
            subject: 'Reset Password',
            text: 'Here is your reset code: ' + resetCode
        };*/
        sendsms(req.body.phone.toString(),'Here is your Reset code : ' + resetCode);
        return res.status(200).json({ message: "Reset code sent successfully" });
    });
};

exports.resetPassword = async (req, res) => {
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) {
        return res.status(400).json({ message: 'phone does not exist' });
    }
    if (user.resetCode === req.body.resetCode) {
        User.findOneAndUpdate({ phone: req.body.phone }, { $set: { password: bcrypt.hashSync(req.body.password, 10) } }, function (error, user) {
            if (error) {
                return res.status(error.code).json(error);
            }
            return res.status(200).json({ message: "Password updated successfully" });
        });
    } else {
        return res.status(400).json({ message: "Invalid credentials!" });
    }
};
exports.updatePassword = async (req, res) => {
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) {
        return res.status(400).json({ message: 'phone does not exist' });
    }
    User.findOneAndUpdate({ phone: req.body.phone }, { $set: { password: bcrypt.hashSync(req.body.password, 10) } }, function (error, user) {
        if (error) {
            return res.status(error.code).json(error);
        }
        return res.status(200).json({ message: "Password updated successfully" });
    });
};
exports.gedt = async (req, res) => {
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) {
        return res.status(400).json({ message: 'phone does not exist' });
    }
    User.findOneAndUpdate({ phone: req.body.phone }, { $set: { password: bcrypt.hashSync(req.body.password, 10) } }, function (error, user) {
        if (error) {
            return res.status(error.code).json(error);
        }
        return res.status(200).json({ message: "Password updated successfully" });
    });
};
exports.deleteAccount = (req, res) => {
    const id = req.body.id;
    User.remove({ _id: id })
        .exec()
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            return res.status(error.code).json({ error: error });
        });
};
exports.getUser = (req, res) => {
    searchUser(req, res, req.params.id);
};
exports.getuserbyphone = (req, res) => {
    searchUserbyphone(req, res, req.params.phone);
};
exports.updateProfile = (req, res) => {
    var imageLink = "";
    if (req.file) {
        imageLink = process.env.BASE_URL + "uploads/" + req.file.filename;
    }
 
    User.findOneAndUpdate({ _id: req.body.id },
    
        {
            $set: {
                Name:req.body.Name,
               phone:req.body.phone,
               gender:req.body.gender,
               email:req.body.email,
               image:imageLink
                
            },
           
        },
        function (error, result) {
            if (error) {
                console.log(error.message);
                 res.status(error.code).json({ error: error });
            }
            res.status(200).json(result);
            
        });
};
exports.signout = (req,res) => {
    res.clearCookie("t"); 
    res.json({message:"signout success"}); 

}
exports.addanim = (req, res) => {

    image = req.file.filename;
    const filePath = `././src/public/uploads/animal/${image}`;
     
   
    if ( !image) {
       fs.unlink(filePath, (err) => {
         if (err) {
           console.log(err);
         }
         return res.json({ error: "All filled must be required" });
       });}
       else 

    User.findOneAndUpdate({ _id: req.body.id }, {
        $addToSet: {
            animal: [{
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                genre: req.body.genre,
                date_naissance: req.body.date_naissance,
                etat_sante: req.body.etat_sante,
                poids: req.body.poids,
                taille: req.body.taille,
                race: req.body.race,
                image: `http://51.75.87.48:14600/profile/${image}`,
                Description: req.body.Description,
                type_animal: {
                    typename: req.body.typename,
                  },

            }],
        }
    }, function (error, result) {
        if (error) {
            console.log(req.body);
            return res.status(error.code).json({ error: error });
        }
        return res.status(200).json(result);
    });
};
exports.editeanimal = (req, res) => {
    
    User.findOneAndUpdate({ _id: req.body.id, 'animal._id': req.body.animal }, {
        $set: {
            'animal.$.name': req.body.name,
            'animal.$.genre': req.body.genre,
            'animal.$.date_de_naissance': req.body.date_naissance,
            'animal.$.type_animal': {
                typename: req.body.typename,
               
            },
            'animal.$.etat_sante': req.body.etat_sante,
            'animal.$.poids': req.body.poids,
            'animal.$.taille': req.body.taille,
            'animal.$.race': req.body.race,
            'animal.$.Description': req.body.Description,

            
        }
    }, function (error, result) {
        if (error) {
            return res.status(error.code).json({ error: error });
        }
        //  console.log(updateOptions);
        return res.status(200).json(result);
    });
};
exports.removeanimal = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.body.id },
        { $pull: { animal: { _id: req.body.animal } } },
        function (error, result) {
            if (error) {
                return res.status(error.code).json({ error: error });
            }
            return res.status(200).json(result);
        });
};
/**
 * to get user by id
 * @param req : request
 * @param res : response
 * @param id : id user

 * we needd it t
 */
 function searchUser(req, res, id) {
    User.findById(id)
        .exec()
        .then((doc) => {
            if (doc) {
                return res.status(200).json(doc);
            } else {
                return res.status(404).json({ message: "404 NOT FOUND" });
            }
        })
        .catch((error) => {
            return res.status(error.code).json({ error: error });
        });
}

exports.getAnimal = (req, res) =>{
   
    User.findOne({_id: req.body.id, 'animal._id': req.body.animal} )
    User.findOne({_id: req.body.id}).select({ animal: {$elemMatch: {_id: req.body.animal}}}).exec().then(event => {
 
    console.log(event);
    res.status(200).json(event);
}).catch(error => {
    console.log(error);
    res.status(error.code).json(error);
});};
/**
 * to get user by phone
 * @param req : request
 * @param res : response

 * @param phone : phone user
 * we needd it t
 */
function searchUserbyphone(req, res, phone) {
    User.findOne(phone)
        .exec()
        .then((doc) => {
            if (doc) {
                return res.status(200).json(doc);
            } else {
                return res.status(404).json({ message: "404 NOT FOUND" });
            }
        })
        .catch((error) => {
            return res.status(error.code).json({ error: error });
        });
}