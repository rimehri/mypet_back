const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const Animal = require('../models/animl');

exports.showallanimal = (req, res) =>{
    Animal.find().exec().then(animal => {
        console.log(animal);
        res.status(200).json(animal);
    }).catch(error => {
        console.log(error);
        res.status(error.code).json({error: error});
    });
};
exports.Addanimal= (req, res) => {
    animal = new Animal({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      genre: req.body.genre,
      date_naissance: req.body.date_naissance,
      etat_sante: req.body.etat_sante,
      poids: req.body.poids,
      taille: req.body.taille,
      race: req.body.race,
      Description: req.body.Description,
  
      type_animal: {
        typename: req.body.typename,
      },
    });
    animal
      .save()
      .then((animal) => {
        res.send(animal);
      })
      .catch((error) => {
        res.status(500).send("Animal was not stored in db");
      });
  };