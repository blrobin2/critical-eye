import React, { Component } from "react";

import { getUser } from './api';

import AlbumTable from "./AlbumTable";

class App extends Component {
  state = {
    user: {}
  };

  async componentWillMount() {
    const { user } = await getUser();
    this.setState({ user });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6">
            <h1>Critical Eye</h1>
          </div>
          <div className="col-sm-6">
            <h3 className="text-right">Hey, {this.state.user.name}</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <AlbumTable />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
