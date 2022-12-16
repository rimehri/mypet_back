const fs = require("fs");

const categoriesFolder = "./src/public/uploads/categories";
const customizeFolder = "./src/public/uploads/customize";
const productsFolder = "./src/public/uploads/products";
const animalFolder = "./src/public/uploads/animal";

const CreateAllFolder = () => {
  if (!fs.existsSync(categoriesFolder)) {
    fs.mkdirSync(categoriesFolder, {
      recursive: true,
    });
  }

  if (!fs.existsSync(customizeFolder)) {
    fs.mkdirSync(customizeFolder, {
      recursive: true,
    });
  }

  if (!fs.existsSync(animalFolder)) {
    fs.mkdirSync(animalFolder, {
      recursive: true,
    });
  }
  if (!fs.existsSync(productsFolder)) {
    fs.mkdirSync(productsFolder, {
      recursive: true,
    });
  }
};

module.exports = CreateAllFolder;
