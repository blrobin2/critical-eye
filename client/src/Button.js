import React from "react";
import * as classNames from "classnames";

export default function Button(props) {
  const btnClass = classNames({
    btn: true,
    [`btn-${props.size}`]: !!props.size,
    [`btn-${props["button-style"]}`]: !!props["button-style"]
  });
  return (
    <button
      className={btnClass}
      type={props.type || "button"}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
