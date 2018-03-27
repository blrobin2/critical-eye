import React, { Component } from 'react';

import Form from './Form';
import FormInput from './FormInput';
import Button from './Button';

export default class AlbumSearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      q: ""
    };
  }
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    this.props.onSearch(this.state.q);
  };

  render() {
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormInput
          name="q"
          type="text"
          placeholder="Album Name"
          label="Album Name"
          sronly="true"
          value={this.state.q}
          onChange={this.handleChange}
        />
        <Button
          type="button"
          button-style="primary"
          onClick={this.handleSubmit}
        >
          Search
        </Button>
      </Form>
    );
  }
}
