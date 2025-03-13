import React from 'react';
import './styles.css';
import { NavLink } from 'react-router-dom';

export  function Login() {
    return (
        <div>
            <header className="title">
                <h1>Login</h1>
            </header>
            <main>
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
