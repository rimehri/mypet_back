const bcrypt = require('bcrypt');

const express = require('express');
const fs = require('fs');
const router = express.Router();
const mailer = require('nodemailer');
const mongoose = require('mongoose');
const User = require('../models/User');
const path = require("path");
/** Config **/
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
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(400).json({ message: 'Email exist' });
    }
    const resetCode = Math.floor(Math.random() * 9999);
    const user = new User({
       
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        Name: req.body.Name,
        addresse: req.body.addresse,
        phone:req.body.phone,

      
        gender: req.body.gender,
        
    
        resetCode: resetCode
    });
    const newUser = await user.save();
    if (newUser) {
        let mailOptions = {
            from: 'rimeh.berrichi@esprit.tn',
            to: req.body.email,
            subject: 'Verify your Account',
            text: 'Here is your verification code: ' + resetCode
        };
        sendmail(mailOptions);
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
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: 'E-mail does not exist' });
    }
    if (user.resetCode === code) {
        User.findOneAndUpdate({ email: req.body.email }, { $set: { isActive: true } }, function (error, user) {
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
    const emailExist = await User.findOne({ email: req.body.email });
    if (!emailExist) {
        return res.status(400).json({ message: 'Email does not exist' });
    }
    const resetCode = Math.floor(Math.random() * 9999);
    User.findOneAndUpdate({ email: req.body.email }, { $set: { resetCode: resetCode } }, function (error, user) {
        if (error) {
            return res.status(error.code).json(error);
        }
        let mailOptions = {
            from: 'rimeh.berrichi@esprit.tn',
            to: req.body.email,
            subject: 'Reset Password',
            text: 'Here is your reset code: ' + resetCode
        };
        sendmail(mailOptions);
        return res.status(200).json({ message: "Reset code sent successfully" });
    });
};
exports.resetPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: 'Email does not exist' });
    }
    if (user.resetCode === req.body.resetCode) {
        User.findOneAndUpdate({ email: req.body.email }, { $set: { password: bcrypt.hashSync(req.body.password, 10) } }, function (error, user) {
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
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: 'Email does not exist' });
    }
    User.findOneAndUpdate({ email: req.body.email }, { $set: { password: bcrypt.hashSync(req.body.password, 10) } }, function (error, user) {
        if (error) {
            return res.status(error.code).json(error);
        }
        return res.status(200).json({ message: "Password updated successfully" });
    });
};