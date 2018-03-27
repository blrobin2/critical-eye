import React from "react";

import AlbumSearchResultItem from "./AlbumSearchResultItem";

export default function AlbumSearchResults(props) {
  return (
    <ul className="search-results">
      {props.albums.map(album => (
        <AlbumSearchResultItem
          key={album.spotifyId}
          onReview={props.onReview}
          {...album}
        />
      ))}
    </ul>
  );
}
