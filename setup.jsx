import React, { useState } from "react";
import "./styles.css";
import { NavLink, useNavigate } from "react-router-dom";

export function Create() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const isPasswordValid = (password) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }
        if (!isPasswordValid(password)) {
            setMessage("Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
            return;
        }
        try {
            const response = await fetch("http://localhost:4000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            setMessage(data.msg);
            if (response.ok) {
                setTimeout(() => navigate("/login"), 2000);
            }
        } catch (error) {
            setMessage("Error registering user.");
        }
    };
    return (
        <div>
            <header className="title">
                <h1>Create Account</h1>
                <link rel="stylesheet" href="styles.css" />
            </header>
            <main>
                <form onSubmit={handleSubmit}>
                    <label className="lab-text">Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /><br />

                    <label className="lab-text">Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />

                    <label className="lab-text">Confirm Password:</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /><br />

                    <div>
                        <p>Password must be a minimum of 8 characters with at least 1 lowercase letter, uppercase letter, number, and special character such as !@#$%</p>
                    </div>
                    {message && <div className="info-box">
                        <p>Your Password does not match</p>
                    </div>}
                    <button className="button-62" type="submit">Sign Up</button>
                </form>
                <NavLink to="/login">
                        <button className="button-62" type="button">
                            Login
                        </button>
                    </NavLink>
            </main>
        </div>
    );
}

