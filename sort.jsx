import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./styles.css";
import { Create } from "./setup";
import { Login } from "./login";
import { Quiz } from "./nope";

export default function Sort() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}

function App() {
    const location = useLocation();
    const isHome = location.pathname === "/";        
    const [pageTitle, setPageTitle] = useState("Take The Weird Zoo Quiz!");
    useEffect(() => {
        if (isHome) {
            setPageTitle("Take The Weird Zoo Quiz!");
        } 
    }, [location]);

    return (
        <div>
            {isHome && (
                <header className="title">
                    <h1>{pageTitle}</h1>
                    <h2>
                        <a href="https://github.com/eastonrodriguez/260-code.git">GitHub Link</a>
                    </h2>
                </header>
            )}
            <main>
                {isHome && (
                    <form>
                        <NavLink to="/login">
                            <button className="button-62" type="button">
                                Login
                            </button>
                        </NavLink>
                        <NavLink to="/setup">
                            <button className="button-62" type="button">
                                Create Account
                            </button>
                        </NavLink>
                    </form>
                )}
            </main>
            <Routes>
                <Route path="/" element={<></>} />
                <Route path="/setup" element={<Create />} />
                <Route path="/login" element={<Login />} />
                <Route path="/nope" element={<Quiz />} />
            </Routes>
        </div>
    );
    
}

