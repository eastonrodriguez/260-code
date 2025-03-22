import React, { useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br />

          <label className="lab-text">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />

          <button className="button-62" type="submit">
            Login
          </button>
        </form>

        {message && (
          <div className="info-box">
            <p>{message}</p>
          </div>
        )}
      </main>
    </div>
  );
}
