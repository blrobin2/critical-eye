import React from "react";
import * as classNames from "classnames";

export default function LinkButton(props) {
  const btnClass = classNames({
    btn: true,
    "text-white": true,
    [`btn-${props.size}`]: !!props.size,
    [`btn-${props["button-style"]}`]: !!props["button-style"]
  });
  return (
    <a className={btnClass} href={props.href} target="_blank">
      {props.children}
    </a>
  );
}
