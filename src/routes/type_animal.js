const { Route } = require("express");
const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const mongoose = require("mongoose");
const{showalltype,Addtype,removetype,addRace, getType} = require("../functions/typeanimal");

// POST CREATE NEW Type animal

router.post("/addtype",Addtype);


router.get("/alltype", showalltype);
router.get("/getType/:typename", getType);
    router.delete("/deleteType",removetype );
// POST CREATE NEW race animal
router.post("/addRace",addRace);

module.exports = router;
//search with name restAPI? 

