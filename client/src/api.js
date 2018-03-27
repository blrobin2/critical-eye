export async function albumSearch(query) {
  const search_json = await fetch(`/search?q=${query}`);
  const search_results = await search_json.json();

  if (search_results.message) {
    alert(search_results.message);
    return;
  }

  return search_results.albums.items.map(album => ({
    spotifyId: album.id,
    artist: album.artists.map(artist => artist.name).join(","),
    album: album.name,
    href: album.external_urls.spotify,
    artwork: album.images[2].url
  }));
}

export async function getAlbumReleaseYear(spotifyId) {
  const album_json = await fetch(`/album/${spotifyId}`);
  const response = await album_json.json();

  if (response.message) {
    alert(response.message);
    return;
  }

  const [releaseYear] = response.album.release_date.split("-");
  return releaseYear;
}