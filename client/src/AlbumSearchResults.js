import React from "react";

import AlbumSearchResultItem from "./AlbumSearchResultItem";

export default function AlbumSearchResults({
  albums,
  onReview
}) {
  return (
    <ul className="search-results">
      {albums.map(album => (
        <AlbumSearchResultItem
          key={album.spotifyId}
          onReview={onReview}
          {...album}
        />
      ))}
    </ul>
  );
}
