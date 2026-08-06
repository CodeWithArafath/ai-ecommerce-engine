const OpenAI = require("openai");


const client = new OpenAI({

apiKey: process.env.OPENAI_API_KEY

});


async function createEmbedding(text){


if(!process.env.OPENAI_API_KEY){

return text
.split("")
.map(x=>x.charCodeAt(0));

}


const response = await client.embeddings.create({

model:"text-embedding-3-small",

input:text

});


return response.data[0].embedding;


}



module.exports={
createEmbedding
};

