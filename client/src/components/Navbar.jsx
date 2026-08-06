function Navbar(){

const logout=()=>{

localStorage.removeItem("token");
window.location.href="/";

}

return(

<div>

<h2>AI Ecommerce Engine</h2>

<button onClick={logout}>
Logout
</button>

</div>

)

}

export default Navbar;
