const { Route } = require("express");
const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const mongoose = require("mongoose");
const{showalltype,Addtype} = require("../functions/animal");

const Animal = require("../models/animl");
// POST CREATE NEW ANIMAL

router.post("/addtype",Addtype);


router.get("/alltype", showalltype);

module.exports = router;
