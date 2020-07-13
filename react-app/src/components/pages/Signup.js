import React, { useState } from "react";
import Navbar from "../layouts/Navbar";
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "../../context/auth";


function Signup(props) {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthTokens } = useAuth();
    // const referer = props.location.state.referer || '/';

    if (JSON.parse(localStorage.getItem("tokens"))) {
        return <Redirect to={'/'} />;
    }

    function postSignup() {
        console.log(name, email, password);
        axios.post("/api/auth/register", {
            name, 
            email,
            password
        }).then(result => {
            console.log(result)
            if (result.status === 200) {
                setAuthTokens(result.data);
                setLoggedIn(true);
            } else {
                setIsError(true);
            }
        }).catch(e => {
            setIsError(true);
        });
    }

    if (isLoggedIn) {
        return <Redirect to={'/'} />;
    }

    return (

        <div className="App">
            <Navbar/>
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <div container>
                        <h3>Sign Up</h3>

                        <div className="form-group">
                            <label>Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                className="form-control" 
                                onChange={e => {
                                    setName(e.target.value);
                                }} 
                                placeholder="Enter email" 
                            />
                        </div>

                        <div className="form-group">
                            <label>Email address</label>
                            <input 
                                type="email" 
                                value={email} 
                                className="form-control" 
                                onChange={e => {
                                    setEmail(e.target.value);
                                }} 
                                placeholder="Enter email" 
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input 
                                type="password" 
                                value={password} 
                                className="form-control" 
                                onChange={e => {
                                        setPassword(e.target.value);
                                }} 
                                placeholder="password" 
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block"
                            onClick={postSignup}>
                            Register
                        </button>
                        <p className="forgot-password text-right">
                            Already registered <a href="#">sign in?</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>

);
}

export default Signup;
