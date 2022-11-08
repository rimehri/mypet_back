
const { loggers } = require('winston');
const fs = require("fs");
const path = require("path");
const productModel = require ("../models/Ecommerce/product")

exports.deleteImages= async (images, mode)=> {
        var basePath =
          path.resolve(__dirname + "../../") + "/uploads/products/";
        console.log(basePath);
        for (var i = 0; i < images.length; i++) {
          let filePath = "";
          if (mode == "file") {
            filePath = basePath + `${images[i].filename}`;
          } else {
            filePath = basePath + `${images[i]}`;
          }
          console.log(filePath);
          if (fs.existsSync(filePath)) {
            console.log("Exists image");
          }
          fs.unlink(filePath, (err) => {
            if (err) {
              logger.error(err);
              return err;
            
            }
          });
        }
      };



      exports.postAddProduct= async(req, res) => {
        let { user , pName, pDescription, pPrice, pQuantity, pCategory, pOffer, pStatus } =
          req.body;
        let images = req.files;
        // Validation
        if (
          !user |
          !pName |
          !pDescription |
          !pPrice |
          !pQuantity |
          
          !pOffer |
          !pStatus
        ) {
          this.deleteImages(images, "file");
          return res.json({ error: "All filled must be required" });
        }
        // Validate Name and description
        else if (pName.length > 255 || pDescription.length > 3000) {
          this.deleteImages(images, "file");
          return res.json({
            error: "Name 255 & Description must not be 3000 charecter long",
          });
        }
        // Validate Images
        else if (images.length !== 2) {
        this.deleteImages(images, "file");
          return res.json({ error: "Must need to provide 2 images" });
        } else {
          try {
            let allImages = [];
            for (const img of images) {
              allImages.push(img.filename);
            }
            let newProduct = new productModel({
              user,
              pImages: allImages,
              pName,
              pDescription,
              pPrice,
              pQuantity,
             
              pOffer,
              pStatus,
            });
            let save = await newProduct.save();
            if (save) {
              return res.json({ success: "Product created successfully" });
            }
          } catch (err) {
            console.log(err);
          }
        }
      };

     exports.getAllProduct= async (req, res)=> {
        try {
          let Products = await productModel
            .find({})
        
            .sort({ _id: -1 });
          if (Products) {
            return res.json({ Products });
          }
        } catch (err) {
          console.log(err);
        }
      }

  exports.postEditProduct = async (req, res) => {
        let {
          pId,
          pName,
          pDescription,
          pPrice,
          pQuantity,
          pCategory,
          pOffer,
          pStatus,
          pImages,
        } = req.body;
        let editImages = req.files;
    
        // Validate other fileds
        if (
          !pId |
          !pName |
          !pDescription |
          !pPrice |
          !pQuantity |
        
          !pOffer |
          !pStatus|
          !pCategory 
        ) {
          return res.json({ error: "All filled must be required" });
        }
        // Validate Name and description
        else if (pName.length > 255 || pDescription.length > 3000) {
          return res.json({
            error: "Name 255 & Description must not be 3000 charecter long",
          });
        }
        // Validate Update Images
        else if (editImages && editImages.length == 1) {
          this.deleteImages(editImages, "file");
          return res.json({ error: "Must need to provide 2 images" });
        } else {
          let editData = {
            pName,
            pDescription,
            pPrice,
            pQuantity,
            pCategory,
            pOffer,
            pStatus,
          };
          if (editImages.length == 2) {
            let allEditImages = [];
            for (const img of editImages) {
              allEditImages.push(img.filename);
            }
            editData = { ...editData, pImages: allEditImages };
            this.deleteImages(pImages.split(","), "string");
          }
          try {
            let editProduct = productModel.findByIdAndUpdate(pId, editData);
            editProduct.exec((err) => {
              if (err) console.log(err);
              return res.json({ success: "Product edit successfully" });
            });
          } catch (err) {
            console.log(err);
          }
        }
      }
      exports.getDeleteProduct= async (req, res) => {
        let { pId } = req.body;
        if (!pId) {
          return res.json({ error: "All filled must be required" });
        } else {
          try {
            let deleteProductObj = await productModel.findById(pId);
            let deleteProduct = await productModel.findByIdAndDelete(pId);
            if (deleteProduct) {
              // Delete Image from uploads -> products folder
              this.deleteImages(deleteProductObj.pImages, "string");
              return res.json({ success: "Product deleted successfully" });
            }
          } catch (err) {
            console.log(err);
          }
        }}