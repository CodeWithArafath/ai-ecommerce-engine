import {useEffect,useState} from "react";
import api from "../../api/axios";

function ProductList(){

const [products,setProducts]=useState([]);

useEffect(()=>{

api.get("/products")
.then(res=>{
setProducts(res.data.data.products)
})

},[]);


const remove=async(id)=>{

await api.delete("/products/"+id,{
headers:{
Authorization:"Bearer "+localStorage.getItem("token")
}
});

setProducts(products.filter(p=>p.id!==id));

};


return(
<div>

<h2>Products</h2>

<a href="/add-product">Add Product</a>

<table border="1">

<tr>
<th>Name</th>
<th>Price</th>
<th>Action</th>
</tr>


{
products.map(p=>(

<tr key={p.id}>

<td>{p.name}</td>

<td>?{p.price}</td>

<td>
<button onClick={()=>remove(p.id)}>
Delete
</button>
</td>

</tr>

))
}

</table>

</div>
)

}

export default ProductList;
