const express = require("express");
const router = express.Router();
const {postAddProduct,getAllProduct,postEditProduct,getDeleteProduct}= require ("../functions/produits");
const { loginCheck, isAuth, isAdmin } = require("../middleware/auth");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/uploads/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });
router.post("/add-product", upload.any(), postAddProduct);
router.get("/all-product",getAllProduct);
router.post("/postEditProduct",upload.any(), postEditProduct);
router.post("/delete-product", getDeleteProduct);
module.exports = router;