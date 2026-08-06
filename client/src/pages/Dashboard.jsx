import {useEffect,useState} from "react";
import API from "../api/axios";


export default function Dashboard(){


const [products,setProducts]=useState([]);


useEffect(()=>{

API.get("/products")
.then(res=>{

setProducts(
res.data.data.products || []
);

});


},[]);



return (

<div>

<h1>
Admin Dashboard
</h1>


<h3>
Products
</h3>


{
products.map(product=>(

<div key={product.id}>

{product.name}

</div>

))

}


</div>

);


}
