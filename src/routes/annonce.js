const { Route } = require("express");
const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const mongoose = require("mongoose");
const{addannonce,getall, removeannonce,updateannonce,getmesannonce,getdemande,getoffre} = require("../functions/annonce");

const Annonce = require("../models/annonce");
router.post('/add', addannonce);
router.get('/getall', getall);
router.delete('/removeannonce', removeannonce);
router.patch('/updateannonce', updateannonce);
router.get('/getmesannonce/:user', getmesannonce);
router.get('/getdemande', getdemande);
router.get('/getoffre', getoffre);
module.exports = router;