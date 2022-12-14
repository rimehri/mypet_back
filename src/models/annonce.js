const mongoose = require ('mongoose');
const { date } = require('yup/lib/locale');
const { ObjectId } = mongoose.Schema.Types;
// categorie annonce Schema
const annonceScema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: ObjectId, ref: "User" },
    Titre: { type: String, require: false },
    prix: { type: Number, require: false },
    description: { type: String, require: false },
    type: { type: String, require: false },
    categorie:{type:String,require: true  },
    photos:[{imagename:{type:String}}],
    date_creation:{
        type:Date,
        require:false,
        
    },
    date_modification:{
        type:Date,
        require:false,
        
    },



});
module.exports = new mongoose.model('annonce',annonceScema);