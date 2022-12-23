
const mongoose = require ('mongoose');

// categorie animal Schema
const categorySchema = new mongoose.Schema({
 
    Name:{
        type:String,
        require:true,
        
    },

        Status:{
          type: Boolean, default: false
          
      },
  
     
    
    



});
module.exports = new mongoose.model('Categorie',categorySchema);