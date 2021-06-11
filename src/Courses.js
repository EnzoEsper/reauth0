import React, { Component } from 'react';

class Courses extends Component {
  state = {
    courses: [],
    message: ""
  };

  componentDidMount = async () => {
    try {
      const response = await fetch("/courses", {
        headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` }
      });
  
      if (response.ok) {
        const responseJson = await response.json();
        this.setState({ courses: responseJson.courses })
      }
    } catch (error) {
      this.setState({ message: error.message })
    }
  }

  render() {
    return (
      <ul>
        {this.state.courses.map(course => {
          return <li key={course.id}>{course.title}</li>
        })}
      </ul>
    );
  }
}

export default Courses;