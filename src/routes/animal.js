const { Route } = require('express');
const express = require ('express');
const { route } = require('express/lib/application');
const router = express.Router();
const mongoose = require('mongoose');

const Animal = require('../models/animl');
// POST CREATE NEW ANIMAL

router.post('/add',(req,res)=>{
animal = new Animal({
    _id: new mongoose.Types.ObjectId(),
    name:req.body.name,
    genre:req.body.genre,
    date_naissance:req.body.date_naissance,
    etat_sante:req.body.etat_sante,
    poids:req.body.poids,
    taille:req.body.taille,
    race:req.body.race,
    Description:req.body.Description,
    
    type_animal:{
        typename:req.body.typename,

    }



}); 
animal.save().then(animal => {
    res.send(animal);

}).catch(error=>{
    res.status(500).send("Animal was not stored in db");
});

    
});
module.exports = router;