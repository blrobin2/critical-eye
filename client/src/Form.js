import React from 'react';
import * as classNames from "classnames";

export default function Form(props) {
  const formClasses = {
    form: true,
    [`form-${props.layout}`]: !!props.layout
  };
  if (props.additionalClasses) {
    props.additionalClasses.split(" ").forEach(clazz => {
      formClasses[clazz] = true;
    });
  }
  return (
    <form className={classNames(formClasses)}>{props.children}</form>
  );
}
