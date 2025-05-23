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
            setMessage("Password does not fit cradentials");
            return;
        }
        try {
            const response = await fetch("/api/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            setMessage(data.msg);
            if (response.ok) {
                setMessage("Username and password were set up successfully!");
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
                <h2>
                    <a href="https://github.com/eastonrodriguez/260-code.git">GitHub Link</a>
                </h2>
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
                    {message && <div className="info-box"><p>{message}</p></div>}
                    {password !== confirmPassword && confirmPassword.length > 0 && (
                    <div className="info-box">
                    <p>Passwords do not match!</p></div>
                    )}
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

