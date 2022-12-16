const express = require('express');
const { type } = require('express/lib/response');
const mongoose = require("mongoose");
const router = express.Router();
const type_animal = require('../models/type_animal');

exports.showalltype = (req, res,next) =>{
    type_animal.find().exec().then(type => {
        console.log(type);
        res.status(200).json(animal);
        return next();
    }).catch(error => {
        console.log(error);
        res.status(error.code).json({error: error});
    });
};
exports.Addtype= (req, res) => {
 
    type = new type_animal({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
     
    });
    type
      .save()
      .then((type) => {
        res.send(type);
      })
      .catch((error) => {
        res.status(500).send("Animal was not stored in db");
      });
  };
  //Gridfs-Strorage-uploading to mangodb storage
  //Grid-stream :Stream data into and out of this storage
  //Crypto this will generate bytes 
  //multer aids in uploading multipart/format to nodejs

