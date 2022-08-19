const mongoose = require ('mongoose');

const TypeAnimal = require ('../models/type_animal');
const AnimalSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        
    },
   genre:{
        type:String,
        require:false,
        
    },
    date_naissance:{
        type:String,
        require:false,
        
    },
    etat_sante:{
        type:String,
        require:false,
        
    },
    poids:{
        type:Number,
        require:false,
        
    },
    taille:{
        type:Number,
        require:false,
        
    },
    race:{
        type:String,
        require:false,
        
    },
    Description:{
        type:String,
        require:false,
        
    },
 type_animal :TypeAnimal.schema,




});
module.exports = new mongoose.model('animal',AnimalSchema);