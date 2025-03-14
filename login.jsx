import React, {useState} from 'react';
import './styles.css';
import { NavLink, useNavigate } from 'react-router-dom';

export  function Login() {
  const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/nope"); 
            } else {
                setMessage(data.msg || "Invalid login credentials.");
            }
        } catch (error) {
            setMessage("Error logging in.");
        }
    };
  
    return (
        <div>
            <header className="title">
                <h1>Login</h1>
            </header>
            <main>
            <form onSubmit={handleLogin}>
                <label className="lab-text">Username:</label>
                <input type="text" /><br />

                <label className="lab-text">Password:</label>
                <input type="password" /><br />

                <NavLink to="/nope">
                    <button className="button-62" type="button">
                        Login
                    </button>
                </NavLink>

                <div className="info-box">
                    <p>Sorry it looks like either your Username or Password is incorrect</p>
                </div>
            </main>   
        </div>
    );
}
