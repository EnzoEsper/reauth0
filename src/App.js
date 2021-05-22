import React, { Component } from 'react';
import { Route } from 'react-router';
import Auth from './Auth/Auth';
import Home from './Home';
import Nav from './Nav';
import Profile from './Profile';
class App extends Component {

  constructor(props) {
    super(props);
    // history will be injected into this component on props because in index we wrap the App with Router.
    this.auth = new Auth(this.props.history);
  }

  render() {
    return (
      <>
        <Nav />
        <div className="body">
          <Route path="/" exact render={props => <Home auth={this.auth} {...props}/>}/>
          <Route path="/profile" component={Profile}/>
        </div>
      </>
    );
  }
}

export default App;
