import React, { PureComponent } from "react";

import FormInput from "./FormInput";

export default class RatingInput extends PureComponent {
  static defaultProps = {
    name: "rating",
    label: "Rating",
    placeholder: "2.5",
    min: "0",
    max: "5",
    step: "0.5"
  };

  // For react-datatable
  getFieldValue() {
    return this.props.value;
  }

  render() {
    return (
      <FormInput
        type="number"
        name={this.props.name}
        label={this.props.label}
        placeholder={this.props.placeholder}
        min={this.props.min}
        max={this.props.max}
        step={this.props.step}
        value={this.props.value}
        onChange={this.props.onChange}
        sronly={this.props.sronly}
        {...this.props}
      />
    )
  }
}