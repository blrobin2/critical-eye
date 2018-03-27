import React from "react";

import ButtonGroup from "./ButtonGroup";
import LinkButton from "./LinkButton";
import Button from "./Button";

export default function AlbumSearchResultItem(props) {
  return (
    <li className="result">
      <img
        src={props.artwork}
        alt={`${props.artist}: ${props.album}`}
        width={props.artworkWidth}
      />
      {props.artist}: {props.album}
      <ButtonGroup size="sm" alignment="right">
        <LinkButton size="sm" button-style="success" href={props.href}>
          Listen
        </LinkButton>
        <Button
          size="sm"
          button-style="info"
          onClick={() => props.onReview(props)}
        >
          Review
        </Button>
      </ButtonGroup>
    </li>
  );
}
