import React from 'react';
import * as classNames from "classnames";

export default function ButtonGroup(props) {
  const btnGroupClasses = classNames({
    "btn-group": true,
    [`btn-group-${props.size}`]: !!props.size
  });
  return (
    <div className={btnGroupClasses} role="group" aria-label="...">
      {props.children}
    </div>
  );
}
