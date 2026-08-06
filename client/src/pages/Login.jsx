import { useState } from "react";
import api from "../api/axios";

function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = async(e)=>{
    e.preventDefault();

    try{
      const res = await api.post("/auth/login",{
        email,
        password
      });

      localStorage.setItem(
        "token",
        res.data.data.token
      );

      alert("Login successful");
      window.location.href="/dashboard";

    }catch(err){
  console.log(err.response);
  alert(
    err.response?.data?.message || 
    "Server error"
  );
}
  };

  return (
    <div>
      <h1>Admin Login</h1>

      <form onSubmit={login}>
        <input
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />

        <button>
          Login
        </button>
      </form>

    </div>
  );
}

export default Login;
