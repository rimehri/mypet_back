
const express = require("express");
const multer = require("multer");
const router = express.Router();
const mongoose = require("mongoose");
// Image Upload setting
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/uploads/categories");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname);
    },});
    const upload = multer({ storage: storage });
const{AddCategorie} = require("../functions/Categorie");


// POST CREATE NEW Categorie

router.post("/AddCategorie", upload.single("cImage"),AddCategorie);




module.exports = router;
