import React, { useState, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Users from "./components/Users/Users";
import User from "./components/Users/User";
import Search from "./components/Users/Search";
import axios from "axios";
import About from "./components/pages/About";
import Alert from "./components/layout/Alert";

import GithubState from "./context/github/GithubState";

import "./App.css";

const App = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  //Get single Github user

  const getUserRepos = async (username) => {
    setLoading(true);

    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created&client_id=${process.env.REACT_APP_GITHUB_CLIENTID}&cllient_id=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );
    setRepos(res.data);
    setLoading(false);
  };

  const setAlertValue = (msg, type) => {
    setAlert({ msg, type });

    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  return (
    <GithubState>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Alert alert={alert} />
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <Fragment>
                    <Search setAlert={setAlertValue} />
                    <Users />
                  </Fragment>
                )}
              ></Route>
              <Route exact path="/about" component={About}></Route>
              <Route
                exact
                path="/user/:login"
                render={(props) => (
                  <User {...props} getUserRepos={getUserRepos} repos={repos} />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    </GithubState>
  );
};

export default App;
