import React, { Component } from "react";

import { login, getUser } from "./api";

import AlbumTable from "./AlbumTable";
import Login from "./Login";

class App extends Component {
  state = {
    user: {}
  };

  async componentWillMount() {
    const { user } = await getUser();
    this.setState({ user });
  }

  handleLogin = async () => {
    await login();
    const { user } = await getUser();
    this.setState({ user });
  };

  render() {
    const isLoggedIn = Object.keys(this.state.user).length > 0;
    return <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6">
            <h1>Critical Eye</h1>
          </div>
          <div className="col-sm-6">
            {isLoggedIn && <h3 className="text-right">
                Hey, {this.state.user.name}
                <br />
                <small>
                  <a href="/auth/logout">Logout</a>
                </small>
              </h3>}
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            {isLoggedIn && <AlbumTable />}
            {isLoggedIn || <Login onClick={this.handleLogin} />}
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4 offset-sm-4 text-center">
            <a href="/privacy-policy">Privacy Policy</a> | <a href="mailto:brobinson88@gmail.com">Contact</a>
          </div>
        </div>
      </div>;
  }
}

export default App;
