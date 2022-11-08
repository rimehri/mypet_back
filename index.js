const express = require ('express');
const session = require ('express-session');
const mongoose = require("mongoose");
const animalroute = require ('./src/routes/animal');
const winston = require ('winston');
const userroute = require ('./src/routes/User');
const annonceroute = require ('./src/routes/annonce');
const produitroute = require ('./src/routes/produit');
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require('jsonwebtoken') 
const PORT  = process.env.PORT || 5000
require('dotenv').config();
// Import Auth middleware for check user login or not~
const { loginCheck } = require("./src/middleware/auth");


//middlewares
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//routes
app.use('/animals',animalroute);
app.use('/annonce',annonceroute);
app.use('/user',userroute);
app.use('/produit',produitroute);
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