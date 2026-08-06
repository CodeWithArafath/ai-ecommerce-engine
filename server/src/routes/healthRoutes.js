const express=require("express");

const router=express.Router();


router.get("/health",(req,res)=>{

res.json({

success:true,

message:"AI Ecommerce Engine API running",

timestamp:new Date()

});


});


module.exports=router;
