const mongoose = require("mongoose");
const TypeAnimal = require ('../models/type_animal');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  Name: { type: String, require: false },
  gender: { type: String, require: false },
 
  addresse:{ type:String },
  phone: { type: Number },
  email: { type: String, require: false, unique: true, lowercase: true },
  password: { type: String, require: false },
  animal: [{
    _id: mongoose.Schema.Types.ObjectId,
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
  image: { type: String, default: "animal.png" },
  type_animal :TypeAnimal.schema,
}],
role:[{
rolename: {type:String},
}],
  image: { type: String, default: "animal.png" },
  resetCode: { type: Number, require: false },
  isActive: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
