const { Route } = require("express");
const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();

const{addToCart,updateCarte} = require("../functions/cart");
router.post('/addToCart', addToCart);
router.put('/updateCarte', addToCart);
module.exports = router;