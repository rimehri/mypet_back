const mongoose = require ('mongoose');
// categorie animal Schema
const TypeAniamlSchema = new mongoose.Schema({
 
    typename:{
        type:String,
        require:true,
        
    },
    sousType: [{
        _id: mongoose.Schema.Types.ObjectId,
        name:{
          type:String,
          require:true,
          
      },
  
     
    }],
    



});
module.exports = new mongoose.model('typeaniaml',TypeAniamlSchema);