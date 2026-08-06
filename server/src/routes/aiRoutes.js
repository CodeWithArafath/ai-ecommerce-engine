const express=require("express");

const router=express.Router();

const {
createEmbedding
}=require("../ai/openaiService");



router.post("/embedding",async(req,res)=>{


try{


const vector =
await createEmbedding(req.body.text);


res.json({

success:true,

embedding:vector

});


}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


});


module.exports=router;

