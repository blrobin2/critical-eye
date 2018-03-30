import React, { Component } from "react";

import AlbumTable from "./AlbumTable";

class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <h1>Critical Eye</h1>
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
