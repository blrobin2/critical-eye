import React from "react";
import * as classNames from "classnames";

export default function FormInput(props) {
  const labelClasses = classNames({
    "sr-only": !!props.sronly
  });
  return (
    <div className="form-group">
      <label htmlFor={props.name} className={labelClasses}>
        {props.label}
      </label>
      <input
        id={props.name}
        className="form-control"
        onChange={props.onChange}
        {...props}
      />
    </div>
  );
}
