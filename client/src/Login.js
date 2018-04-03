import React from "react";

import Button from "./Button";

export default function Login(props) {
  return (
    <div>
      <p>Track and rate the albums you listen to</p>
      <Button button-style="success" onClick={props.onClick}>Login with Spotify</Button>
    </div>
  );
}