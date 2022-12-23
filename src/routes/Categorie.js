
const express = require("express");
const multer = require("multer");
const router = express.Router();
const mongoose = require("mongoose");
// Image Upload setting

const{AddCategorie,showAllCategorie,removeCategorie} = require("../functions/Categorie");

// POST CREATE NEW Categorie

router.post("/AddCategorie",AddCategorie);
router.get("/showAllCategorie",showAllCategorie);
router.delete("/removeCategorie",removeCategorie);




module.exports = router;
