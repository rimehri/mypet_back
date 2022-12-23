
const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

const Categorie = require ('../models/Ecommerce/categories');


exports.AddCategorie = async (req, res) =>{
  type2 = new Categorie({
    _id: new mongoose.Types.ObjectId(),
    Name: req.body.Name,
    Status:req.body.Status,
   
  });
  type2
    .save()
    .then((type2) => {
      res.send(type2);
    })
    .catch((error) => {
      res.status(500).send("Categorie was not stored in db");
    });
}
exports.showAllCategorie = (req, res,next) =>{
  Categorie.find().exec().then(type => {
      console.log(type);
      res.status(200).json(type);
      return next();
  }).catch(error => {
      console.log(error);
      res.status(error.code).json({error: error});
  });
};
exports.removeCategorie = (req, res) => {
  const id = req.body.id;
  Categorie.remove({ _id: id })
      .exec()
      .then((result) => {
          return res.status(200).json(result);
      })
      .catch((error) => {
          return res.status(error.code).json({ error: error });
      });
};