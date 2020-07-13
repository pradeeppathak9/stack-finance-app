import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import Login from "./components/pages/Login";
import SignUp from "./components/pages/Signup";
import Home from "./components/pages/Home";
import Portfolio from "./components/pages/Portfolio";
import { AuthContext } from "./context/auth";


function App() {
  const [authTokens, setAuthTokens] = useState(JSON.parse(localStorage.getItem("tokens")));

  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }

  return (
  <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
    <Router>
        <Switch>
          <PrivateRoute exact path='/' component={Home} />
          <PrivateRoute exact path='/portfolio' component={Portfolio} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={SignUp} />
        </Switch>
    </Router>
  </AuthContext.Provider>
  );
}
export default App;
