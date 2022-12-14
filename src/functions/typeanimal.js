const { name } = require('ejs');
const express = require('express');
const winston = require ('winston');
const mongoose = require("mongoose");
const router = express.Router();
const type = require('../models/type_animal');
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

//Gestion Type Animal (chat /cheien...)
exports.showalltype = (req, res,next) =>{
    type.find().exec().then(type => {
        console.log(type);
        res.status(200).json(type);
        return next();
    }).catch(error => {
        console.log(error);
        res.status(error.code).json({error: error});
    });
};
exports.Addtype= (req, res) => {
 
    type2 = new type({
      _id: new mongoose.Types.ObjectId(),
      typename: req.body.typename,
     
    });
    type2
      .save()
      .then((type2) => {
        res.send(type2);
      })
      .catch((error) => {
        res.status(500).send("Animal was not stored in db");
      });
  };

  exports.removetype = (req, res) => {
    const id = req.body.id;
    type.remove({ _id: id })
        .exec()
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            return res.status(error.code).json({ error: error });
        });
};
//Gestion sous Type (Race :chien berger ,labrador.....)
exports.addRace = (req, res) => {
  type.findOneAndUpdate({ _id: req.body._id }, {
      $addToSet: {
        sousType: [{
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
             

          }],
      }
  }, function (error, result) {
      if (error) {
          console.log(req.body);
          return res.status(error.code).json({ error: error });
      }
      return res.status(200).json(result);
  });
};
/**
 * to get user by phone
 * @param req : request
 * @param res : response

 * @param typename : typename 
 * we needd it t
 */

function searchType(req, res,typename) {

    type.find({typename})
        .exec()
        .then((doc) => {
            if (doc) {
                return res.status(200).json(doc);
            } else {
                return res.status(404).json({ message: "404 NOT FOUND" });
            }
        })
        .catch((error) => {
            logger.error(error.message);
        });
  };
exports.getType = (req, res) => {
    searchType(req, res, req.params.typename);
};
