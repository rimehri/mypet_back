const express = require ('express');

const mongoose = require("mongoose");
const animalroute = require ('./src/routes/animal');
const winston = require ('winston');

const userroute = require ('./src/routes/User');
const annonceroute = require ('./src/routes/annonce');
const categorieroute =  require ('./src/routes/Categorie');
const produitroute = require ('./src/routes/produit');
const cartroute = require ('./src/routes/Cart');
const expressValidator = require("express-validator");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const PORT  = process.env.PORT || 5000
require('dotenv').config();
// Import Auth middleware for check user login or not~
const { loginCheck } = require("./src/middleware/auth");

const CreateAllFolder = require("./src/config/uploadFolderCreateScript");
//middlewares
app.use('/profile', express.static('upload/images')); 
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use(expressValidator())
app.use(express.static("public"));
app.use(express.json());

app.use(express.urlencoded({extended:true}));
//routes
app.use('/animals',animalroute);

app.use('/annonce',annonceroute);
app.use('/user',userroute);
app.use('/produit',produitroute);
app.use('/Categorie',categorieroute);
app.use('/cart',cartroute);
const logger = winston.createLogger({
    level:'info',
    transports: [
        new winston.transports.Console({
            format:winston.format.combine(
                winston.format.colorize({all:true})
            )
        }),
        new winston.transports.File({filename:'error.log',level:'error'})
    ],
    exceptionHandlers:[
        new winston.transports.File({filename:'exception.log'})
    ]
});


app.use('/profile', express.static('././src/public/uploads/animal'));



/* Create All Uploads Folder if not exists | For Uploading Images */
CreateAllFolder();
//connect to mongodb atlas
mongoose.connect(process.env.MONGO_URL,


{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

).then(()=>{
logger.info("connected to mongodb atlas");

}).catch(error=>{
    logger.error(error.message);
    
})
app.listen(PORT,()=>{

    logger.info(`Server start at PORT ${PORT}`);
});