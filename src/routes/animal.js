const { Route } = require("express");
const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const mongoose = require("mongoose");
const{showallanimal,Addanimal} = require("../functions/animal");

const Animal = require("../models/animl");
// POST CREATE NEW ANIMAL

router.post("/add",Addanimal);


router.get("/all", showallanimal);

module.exports = router;
