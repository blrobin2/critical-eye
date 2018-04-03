export async function albumSearch(query) {
  const search_results = await fetchWithCredentials(`/album/search?q=${query}`);

  if (search_results.message) {
    alert(search_results.message);
    return [];
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
  const response = await fetchWithCredentials(`/album/${spotifyId}`);

  if (response.message) {
    alert(response.message);
    return;
  }

  const [releaseYear] = response.album.release_date.split("-");
  return releaseYear;
}

export async function getUser() {
  return await fetchWithCredentials('/user');
}

export async function login() {
  window.location.replace('/auth/login');
}

export async function logout() {
  window.location.replace('/auth/logout');
}

async function fetchWithCredentials(url) {
  const json = await fetch(url, { credentials: 'include' });
  return await json.json();
}