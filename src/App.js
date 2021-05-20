import React, { Component } from 'react';
import { Route } from 'react-router';
import Home from './Home';
import Nav from './Nav';
import Profile from './Profile';
class App extends Component {
  render() {
    return (
      <>
        <Nav />
        <Route path="/" exact component={Home}/>
        <Route path="/profile" component={Profile}/>
      </>
    );
  }
}

export default App;
