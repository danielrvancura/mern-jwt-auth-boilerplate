import React, { Component } from 'react';
import './App.css';
import Signup from './Signup';
import Login from './Login';
import {UserProfile} from './UserProfile';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super()
    this.state = {
      token: '',
      user: {}
    }
    this.liftTokenToState = this.liftTokenToState.bind(this)
    this.logout = this.logout.bind(this)

  }

  liftTokenToState(data) {
    this.setState({
      token: data.token,
      user: data.user
    })
  }

  logout() {
    console.log("Logging out")
    localStorage.removeItem('mernToken')
    this.setState({token: '', user: {}})
  }
  componentDidMount() {
    var token = localStorage.getItem('mernToken')
    if (token === 'undefined' || token === null || token === '' || token === undefined) {
      localStorage.removeItem('mernToken')
      this.setState({
        token: '',
        user: {}
      })
    } else {
      console.log("we found a token! verifying...")
      axios.post('/auth/me/from/token', {
        token: token
      }).then( result => {
        console.log("Got result back from auth me from token")
        localStorage.setItem('mernToken', result.data.token)
        this.setState({
          token: result.data.token,
          user: result.data.user
        })
      }).catch( err => console.log(err) )
    }
  }
  render() {
    let theUser = this.state.user
    if (typeof this.state.user === 'object' && Object.keys(this.state.user).length > 0) {
      return (
        <div>
        <UserProfile user={theUser} logout={this.logout} />
        </div>
      )
    } else {
      return (
        <div className="App">
          <Signup liftToken={this.liftTokenToState} />
          <Login liftToken={this.liftTokenToState} />
        </div>
      )
    }
  }
}

export default App;
