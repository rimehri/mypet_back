const express = require ('express');

const mongoose = require("mongoose");
const animalroute = require ('./src/routes/animal');
const app = express();
const PORT  = process.env.PORT || 3000
require('dotenv').config();
//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//routes
app.use('/animals',animalroute);

//connect to mongodb atlas
mongoose.connect(process.env.MONGO_URL,


{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

).then(()=>{
console.log("Connecte to Mongodb atlas");

}).catch(error=>{
    console.log("Somthing happened",error);
})
app.listen(PORT,()=>{

    console.log("Server start at PORT ",PORT);
});