import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";
import Auth from "./Auth/Auth";
import Callback from "./Callback";
import Courses from "./Courses";
import Home from "./Home";
import Nav from "./Nav";
import Private from "./Private";
import Profile from "./Profile";
import Public from "./Public";
import PrivateRoute from "./PrivateRoute";
import AuthContext from "./AuthContext";
class App extends Component {
  constructor(props) {
    super(props);
    // history will be injected into this component on props because in index we wrap the App with Router.
    this.state = {
      auth: new Auth(this.props.history)
    };
  }

  render() {
    const { auth } = this.state;
    return (
      <AuthContext.Provider value={auth}>
        <Nav auth={auth} />
        <div className="body">
          <Route
            path="/"
            exact
            render={(props) => <Home auth={auth} {...props} />}
          />
          <Route
            path="/callback"
            render={(props) => <Callback auth={auth} {...props} />}
          />
          {/* <Route
            path="/profile"
            render={(props) =>
              this.auth.isAuthenticated() ? (
                <Profile auth={this.auth} {...props} />
              ) : (
                <Redirect to="/" />
              )
            }
          /> */}
          <PrivateRoute path="/profile" component={Profile} />
          <Route path="/public" component={Public} />
          {/* <Route
            path="/private"
            render={(props) => this.auth.isAuthenticated() ? <Private auth={this.auth} {...props} /> : this.auth.login()}
          /> */}
          <PrivateRoute path="/private" component={Private} />
          {/* <Route
            path="/courses"
            render={(props) => this.auth.isAuthenticated() && this.auth.userHasScopes(["read:courses"]) ? <Courses auth={this.auth} {...props} /> : this.auth.login()}
          /> */}
          <PrivateRoute path="/courses" component={Courses} scopes={["read:courses"]} />
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
