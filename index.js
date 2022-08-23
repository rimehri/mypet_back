const express = require ('express');

const mongoose = require("mongoose");
const animalroute = require ('./src/routes/animal');
const winston = require ('winston');
const userroute = require ('./src/routes/User');
const app = express();
const PORT  = process.env.PORT || 3000
require('dotenv').config();
//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//routes
app.use('/animals',animalroute);
app.use('/user',userroute);
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