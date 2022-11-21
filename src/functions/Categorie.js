
const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

const Categorie = require ('../models/Ecommerce/categories')
exports.AddCategorie = async (req, res) =>{
  let { cName, cDescription, cStatus } = req.body;
  let cImage = req.file.filename;
  const filePath = `../server/public/uploads/categories/${cImage}`;

  if (!cName || !cDescription || !cStatus || !cImage) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
      }
      return res.json({ error: "All filled must be required" });
    });
  } else {
    cName = toTitleCase(cName);
    try {
      let checkCategoryExists = await categoryModel.findOne({ cName: cName });
      if (checkCategoryExists) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
          return res.json({ error: "Category already exists" });
        });
      } else {
        let newCategory = new categoryModel({
          cName,
          cDescription,
          cStatus,
          cImage,
        });
        await newCategory.save((err) => {
          if (!err) {
            return res.json({ success: "Category created successfully" });
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
