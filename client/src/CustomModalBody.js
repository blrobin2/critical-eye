import React, { Component } from "react";

import { getDatetimeLocal, getCurrentYear } from "./util";

import AlbumEditForm from "./AlbumEditForm";

export default class CustomModalBody extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState(this.props);
  }

  getInitialState = (props = {}) => ({
    id: props.id || 0,
    artist: props.artist || "",
    album: props.album || "",
    spotifyId: props.spotifyId || "",
    artwork: props.artwork || "",
    href: props.href || "",
    dateListened: props.dateListened || getDatetimeLocal(),
    yearReleased: props.yearReleased || getCurrentYear(),
    rating: props.rating || 2.5,
    description: props.description || ""
  });

  // Ensures that when we set current album above, this form updates
  componentWillReceiveProps(nextProps) {
    this.setState(this.getInitialState(nextProps));
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getFieldValue() {
    const album = this.state;
    return album;
  }

  render() {
    return (
      <div className="modal-body">
        <AlbumEditForm onChange={this.handleChange} {...this.state} />
      </div>
    );
  }
}
