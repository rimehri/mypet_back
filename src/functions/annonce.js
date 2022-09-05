const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const Annonce = require('../models/annonce');
exports.addannonce= (req, res) => {
    annonce = new Annonce({
      _id: new mongoose.Types.ObjectId(),
      Titre: req.body.Titre,
      idUser: req.body.idUser,
      description: req.body.description,
      type: req.body.type,
      categorie: req.body.categorie,
      photos: req.body.photos,
      user:   req.body.user ,
     
      
    });
    annonce
      .save()
      .then((annonce) => {
        res.send(annonce);
      })
      .catch((error) => {
        res.status(500).send("annonce was not stored in db");
      });
  };
  exports.getall = (req, res,next) =>{
    Annonce.find().exec().then(annonce => {
        console.log(annonce);
        res.status(200).json(annonce);
        return next();
    }).catch(error => {
        console.log(error);
        res.status(error.code).json({error: error});
    });
};
exports.updateannonce = (req, res) => {
 
 
    Annonce.findOneAndUpdate({ _id: req.body.id },
    
        {
            $set: {
                Titre:req.body.Titre,
               description:req.body.description,
               type:req.body.type,
               categorie:req.body.categorie,
            
                
            },
           
        },
        function (error, result) {
            if (error) {
                logger.error(error.message);
                 res.status(error.code).json({ error: error });
            }
            res.status(200).json(result);
            
        });
};
exports.removeannonce = (req, res) => {
    Annonce.deleteOne({ _id: req.body.id }).exec().then(result => {
        return res.status(200).json(result);
    }).catch(error => {
        logger.error(error.message);
        return res.status(error.code).json(error);
    });
};
exports.getmesannonce = (req, res) => {
    Annonce.find(
        {user:req.body.user}).exec().then(result => {
        return res.status(200).json(result);
    }).catch(error => {
        logger.error(error.message);
        return res.status(error.code).json(error);
    });
};
exports.getdemande =(req,res) => {
    Annonce.find(
        {type:"demande"}
    ).exec().then(result => {
        return res.status(200).json(result);
    }).catch(error => {
        logger.error(error.message);
        return res.status(error.code).json(error);
    });
};
exports.getoffre =(req,res) => {
    Annonce.find(
        {type:"offre"}
    ).exec().then(result => {
        return res.status(200).json(result);
    }).catch(error => {
        logger.error(error.message);
        return res.status(error.code).json(error);
    });
};
/**
 * to get annonce by user
 * @param req : request
 * @param res : response
 * @param user : id user
 * we needd it t
 */
function searchannoncebyuser(req, res, user) {
    Annonce.find(user)
        .exec()
        .then((doc) => {
            if (doc) {
                return res.status(200).json(doc);
            } else {
                return res.status(404).json({ message: "404 NOT FOUND" });
            }
        })
        .catch((error) => {
            return res.status(error.code).json({ error: error });
        });
}