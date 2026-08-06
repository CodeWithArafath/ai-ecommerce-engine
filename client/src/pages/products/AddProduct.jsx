import {useState} from "react";
import api from "../../api/axios";

function AddProduct(){

const [name,setName]=useState("");
const [price,setPrice]=useState("");


const submit=async(e)=>{

e.preventDefault();

await api.post("/products",
{
name,
price,
brand:"Demo",
category:"Electronics",
description:"Product"
},
{
headers:{
Authorization:"Bearer "+localStorage.getItem("token")
}
}
);

alert("Added");

window.location.href="/products";

};


return(
<form onSubmit={submit}>

<h2>Add Product</h2>

<input placeholder="Name"
onChange={e=>setName(e.target.value)}
/>

<input placeholder="Price"
onChange={e=>setPrice(e.target.value)}
/>

<button>
Save
</button>

</form>
)

}

export default AddProduct;
