
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
