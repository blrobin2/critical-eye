import React from "react";

import AlbumSearchForm from "./AlbumSearchForm";
import AlbumSearchResults from "./AlbumSearchResults";

export default function AlbumSearch({
  onSearch,
  onReview,
  albums
}) {
  return (
    <div>
      <AlbumSearchForm onSearch={onSearch} />
      <AlbumSearchResults albums={albums} onReview={onReview} />
    </div>
  );
}
