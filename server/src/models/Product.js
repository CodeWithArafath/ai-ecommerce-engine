const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
 name:{
  type:String,
  required:true
 },
 description:String,
 brand:String,
 category:String,
 price:Number,
 stock:{
  type:Number,
  default:0
 },
 image:String
},
{
 timestamps:true
}
);

module.exports = mongoose.model("Product",productSchema);
