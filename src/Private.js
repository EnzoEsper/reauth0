import React, { Component } from 'react';

class Private extends Component {
  state = {
    message: ""
  };

  componentDidMount = async () => {
    try {
      const response = await fetch("/private", {
        headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` }
      });
  
      if (response.ok) {
        const responseJson = await response.json();
        this.setState({ message: responseJson.message })
      }
    } catch (error) {
      this.setState({ message: error.message })
    }
  }

  render() {
    return (
      <p>{this.state.message}</p>
    );
  }
}

export default Private;