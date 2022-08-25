const bcrypt = require('bcrypt');

const express = require('express');
const fs = require('fs');
const router = express.Router();
const mailer = require('nodemailer');
const mongoose = require('mongoose');
const User = require('../models/User');
const path = require("path");

const { loggers } = require('winston');
var sid ='ACcdf6c386721ee79115b1c1b4654bb20b';
var auth_token = '5aa1b778bc11750c1f37bd99760822a3';
const twilio = require('twilio')(sid,auth_token);
const sendsms= (phone,message)=>{
    twilio.messages.create({
from:'+12243282744',
to  :'+216'+phone,
body:message

}).then((res)=>loggers.info("message has sent!")).catch((err)=>{
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
    if (PhoneExist) {
        return res.status(400).json({ message: 'Phone exist' });
    }
    const resetCode = Math.floor(Math.random() * 9999);
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        Name: req.body.Name,
        add: req.body.add,
        phone:req.body.phone,

      
        gender: req.body.gender,
        
    
        resetCode: resetCode
    });
    const newUser = await user.save();
    if (newUser) {
    /*    let mailOptions = {
            from: 'rimeh.berrichi@esprit.tn',
            to: req.body.email,
            subject: 'Verify your Account',
            text: 'Here is your verification code: ' + resetCode
        };*/
        sendsms(req.body.phone.toString(),'Here is your verification code: ' + resetCode);
        return res.status(201).json(newUser);
    }
    
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
exports.login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: 'E-mail does not exist' });
    }
    const verifyPassword = await bcrypt.compare(req.body.password, user.password);
    if (!verifyPassword) {
        return res.status(400).send({ message: 'Password is invalid' });
    }
    if (!user.isActive) {
        return res.status(400).send({ message: 'Account is disabled' });
    }
    return await res.status(200).json(user);
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
exports.updateProfile = (req, res) => {
 
    User.findOneAndUpdate({ _id: req.body.id },
    
        {
            $set: {
                Name:req.body.Name,
               phone:req.body.phone
                
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