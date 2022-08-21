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
            from: 'mypetofficielapplication@gmail.com',
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