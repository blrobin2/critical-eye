import React, { PureComponent } from 'react';

import FormInput from './FormInput';
import { getCurrentYear } from './util';

export default class YearInput extends PureComponent {
  static defaultProps = {
    min: "1900",
    max: getCurrentYear(),
    placeholder: getCurrentYear(),
    step: "1"
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
    );
  }
}