import React, { useState } from "react";
import Navbar from "../layouts/Navbar";
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "../../context/auth";

function Login(props) {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthTokens } = useAuth();
    // const referer = props.location.state.referer || '/';

    if (JSON.parse(localStorage.getItem("tokens"))) {
        return <Redirect to={'/'} />;
    }
    // console.log(isLoggedIn);

    function postLogin() {
        console.log(email, password);
        axios.post("/api/auth/login", {
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
                      <h3>Sign In</h3>
        
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
        
                      <div className="form-group">
                          <div className="custom-control custom-checkbox">
                              <input type="checkbox" className="custom-control-input" id="customCheck1" />
                              <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                          </div>
                      </div>
        
                      <button type="submit" className="btn btn-primary btn-block" 
                          onClick={postLogin}>
                          Submit
                      </button>

                      <p className="forgot-password text-right">
                          Forgot <a href="#">password?</a>
                      </p>
                  </div>
            </div>
          </div>

        </div>
    );
}


export default Login;
