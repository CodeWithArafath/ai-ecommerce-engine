import {useState} from "react";
import API from "../api/axios";
import {useNavigate} from "react-router-dom";


export default function Login(){


const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const navigate=useNavigate();


const login=async()=>{

try{

const res=await API.post("/auth/login",{
email,
password
});


localStorage.setItem(
"token",
res.data.data.token
);


navigate("/dashboard");


}catch(err){

alert("Invalid login");

}


};


return (

<div>

<h2>Admin Login</h2>

<input
placeholder="Email"
onChange={e=>setEmail(e.target.value)}
/>


<input
placeholder="Password"
type="password"
onChange={e=>setPassword(e.target.value)}
/>


<button onClick={login}>
Login
</button>


</div>

);


}
