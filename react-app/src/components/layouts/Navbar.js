import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

function Navbar() {
  var loggedIn = false;
  
  if (JSON.parse(localStorage.getItem("tokens"))) {
      loggedIn = true;
  }
  // console.log(loggedIn)

  function logout(e) {
    e.preventDefault();
    localStorage.clear();
    window.location.reload();
    // return <Redirect to={'/login'} />;
  }

    return (
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/"}>Stack Finance App</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            {loggedIn ? 
              <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/"}>Stocks</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/portfolio"}>Portfolio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" onClick={logout}>Logout</Link>
              </li>
            </ul>
            : 
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/login"}>Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/register"}>Sign up</Link>
              </li>
            </ul>
            } 
          </div>
        </div>
      </nav>
    );
}


export default Navbar;
