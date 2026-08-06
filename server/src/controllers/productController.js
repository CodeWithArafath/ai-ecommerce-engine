const Product = require("../models/Product");
const {success,error}=require("../utils/apiResponse");


exports.getProducts = async(req,res)=>{
try{

const {
search,
category,
page=1,
limit=20,
sort
}=req.query;


let query={};


if(search){
query={
$or:[
{name:{$regex:search,$options:"i"}},
{brand:{$regex:search,$options:"i"}},
{category:{$regex:search,$options:"i"}}
]
};
}


if(category){
query.category=category;
}


let products=await Product.find(query)
.sort(sort==="price"?{price:1}:{})
.skip((page-1)*limit)
.limit(Number(limit));


const total=await Product.countDocuments(query);


return success(res,{
products,
total,
page:Number(page),
limit:Number(limit)
},"Products fetched successfully");


}catch(err){
return error(res,err.message);
}

};



exports.createProduct=async(req,res)=>{
try{

const product=await Product.create(req.body);

return success(res,product,"Product created successfully",201);

}catch(err){
return error(res,err.message);
}

};


exports.getProduct=async(req,res)=>{
try{

const product=await Product.findById(req.params.id);

return success(res,product);

}catch(err){
return error(res,err.message);
}

};


exports.updateProduct=async(req,res)=>{
try{

const product=await Product.findByIdAndUpdate(
req.params.id,
req.body,
{new:true}
);

return success(res,product,"Product updated");

}catch(err){
return error(res,err.message);
}

};


exports.deleteProduct=async(req,res)=>{
try{

await Product.findByIdAndDelete(req.params.id);

return success(res,null,"Product deleted");


}catch(err){
return error(res,err.message);
}

};
