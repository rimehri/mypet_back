const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

const winston = require ('winston');
const Cart = require('../models/Ecommerce/Cart');
const logger = winston.createLogger({
    level:'info',
    transports: [
        new winston.transports.Console({
            format:winston.format.combine(
                winston.format.colorize({all:true})
            )
        }),
        new winston.transports.File({filename:'error.log',level:'error'})
    ],
    exceptionHandlers:[
        new winston.transports.File({filename:'exception.log'})
    ]
});
exports.addToCart=  async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
};

//UPDATE
exports.updateCarte= async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
}
