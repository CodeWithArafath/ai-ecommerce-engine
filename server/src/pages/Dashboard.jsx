import { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard(){

const [products,setProducts]=useState([]);

useEffect(()=>{

api.get("/products")
.then(res=>{
setProducts(res.data.data.products);
});

},[]);


return(
<div>

<h1>Admin Dashboard</h1>

<h2>Products</h2>

<table border="1">

<thead>
<tr>
<th>Name</th>
<th>Brand</th>
<th>Category</th>
<th>Price</th>
</tr>
</thead>


<tbody>

{
products.map(product=>(
<tr key={product.id}>
<td>{product.name}</td>
<td>{product.brand}</td>
<td>{product.category}</td>
<td>₹{product.price}</td>
</tr>
))
}

</tbody>

</table>

</div>
)

}

export default Dashboard;