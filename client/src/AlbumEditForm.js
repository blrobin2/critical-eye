import React, { Component } from "react";

import Form from "./Form";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextarea";

import { getDatetimeLocal, getCurrentYear } from "./util";

export default class AlbumEditForm extends Component {
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
      <Form>
        <FormInput
          name="artist"
          type="text"
          label="Artist"
          placeholder="Artist"
          required={true}
          value={this.state.artist}
          onChange={this.handleChange}
        />
        <FormInput
          type="text"
          name="album"
          label="Album"
          placeholder="Album"
          required={true}
          value={this.state.album}
          onChange={this.handleChange}
        />
        <FormInput
          type="text"
          name="spotifyId"
          label="Spotify ID"
          placeholder="Spotify ID"
          required={true}
          value={this.state.spotifyId}
          onChange={this.handleChange}
        />
        <FormInput
          type="url"
          name="artwork"
          label="Artwork URL"
          placeholder="https://"
          value={this.state.artwork}
          onChange={this.handleChange}
        />
        <FormInput
          type="url"
          name="href"
          label="Listen URL"
          placeholder="https://"
          value={this.state.href}
          onChange={this.handleChange}
        />
        <FormInput
          type="datetime-local"
          name="dateListened"
          label="Date Listened"
          value={this.state.dateListened}
          required={true}
          onChange={this.handleChange}
        />
        <FormInput
          type="number"
          name="yearReleased"
          label="Year Released"
          placeholder="2018"
          min="1900"
          step="1"
          value={this.state.yearReleased}
          onChange={this.handleChange}
        />
        <FormInput
          type="number"
          name="rating"
          label="Rating"
          placeholder="2.5"
          min="0"
          max="5"
          step="0.5"
          value={this.state.rating}
          onChange={this.handleChange}
        />
        <FormTextarea
          name="description"
          label="Description"
          value={this.state.description}
          onChange={this.handleChange}
        />
      </Form>
    );
  }
}
