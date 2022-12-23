
const express = require("express");
const multer = require("multer");
const router = express.Router();
const mongoose = require("mongoose");
// Image Upload setting



// POST CREATE NEW Categorie

router.post("/AddCategorie",AddCategorie);




module.exports = router;
