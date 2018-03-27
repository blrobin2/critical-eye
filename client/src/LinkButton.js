import React, { Component } from "react";
import * as classNames from "classnames";

export default class LinkButton extends Component {
  render() {
    const btnClass = classNames({
      btn: true,
      "text-white": true,
      [`btn-${this.props.size}`]: !!this.props.size,
      [`btn-${this.props["button-style"]}`]: !!this.props["button-style"]
    });
    return (
      <a className={btnClass} href={this.props.href} target="_blank">
        {this.props.children}
      </a>
    );
  }
}
