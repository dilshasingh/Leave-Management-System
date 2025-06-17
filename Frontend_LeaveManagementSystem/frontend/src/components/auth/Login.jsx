import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import illustration from "../../assets/leave.jpg";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword]=useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await axios.post("http://localhost:8080/api/auth/login", {
      email : email,
      password : password,
    })
      console.log(response.data);

    const user = response.data; 
  
    console.log(user)
    console.log(user.role)
    


    sessionStorage.setItem("user", JSON.stringify(user));

    if (user.role === "ADMIN") {
      navigate("/admin");
    } else if (user.role === "EMPLOYEE") {
      navigate("/dashboard");
    } else {
      setError("Unknown user role.");
    }
    console.log("success");
  } catch (err) {
    if (err.response && err.response.status === 401) {
      setError("Invalid email or password.");
    } else {
      setError("Server error. Please try again later.");
    }
  }
};


  return (
    <div className="login-page">
     
      <div className="login-left">
         <h1 className="heading">LEAVE TRACKER APP</h1>
        <h1 className="title">Welcome back!</h1>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}
          
          <button type="submit">Login</button>
        </form>

        
      </div>

      <div className="login-right">
       <img src={illustration} alt="Illustration" />

        
      </div>
    </div>
  );
}

export default Login;
