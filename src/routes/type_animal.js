const { Route } = require("express");
const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const mongoose = require("mongoose");
const{showalltype,Addtype,removetype,addRace} = require("../functions/typeanimal");

// POST CREATE NEW Type animal

router.post("/addtype",Addtype);


router.get("/alltype", showalltype);

    router.delete("/deleteType",removetype );
// POST CREATE NEW race animal
router.post("/addRace",addRace);

module.exports = router;
