import React from 'react';

import AlbumSearchForm from './AlbumSearchForm';
import AlbumSearchResults from './AlbumSearchResults';

export default function AlbumSearch(props) {
  return (
    <div>
      <AlbumSearchForm onSearch={props.onSearch} />
      <AlbumSearchResults
        albums={props.albums}
        onReview={props.onReview}
      />
    </div>
  );
}
