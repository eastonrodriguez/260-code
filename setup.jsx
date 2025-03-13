import React from 'react';
import './styles.css'
import { NavLink } from 'react-router-dom';

export function Create() {
    return (
        <div>
            <header className="title">
                <h1>Create Account</h1>
                <link rel="stylesheet" href="styles.css" />
            </header>
            <main>
                <form>
                    <label className="lab-text">Username:</label>
                    <input type="text" /><br />

                    <label className="lab-text">Password:</label>
                    <input type="password" /><br />

                    <label className="lab-text">Confirm Password:</label>
                    <input type="password" /><br />

                    <div>
                        <p>Password must be a minimum of 8 characters with at least 1 lowercase letter, uppercase letter, number, and special character such as !@#$%</p>
                    </div>
                    <div className="info-box">
                        <p>Your Password does not match</p>
                    </div>

                    <NavLink to="/login">
                        <button className="button-62" type="button">
                            Sign Up
                        </button>
                    </NavLink>
                </form>
            </main>
        </div>
    );
}

