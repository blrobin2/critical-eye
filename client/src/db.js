import Dexie from 'dexie';


const db = new Dexie("albums_listened");
db.version(1).stores({
  albums:
    "++id, rating, &spotifyId, dateListened, artwork, album, artist, href, description, yearReleased"
});

db.open().catch(e => {
  console.error(`Open failed: ${e}`);
});

export async function getAlbums() {
  return await db.albums.orderBy('rating').desc().toArray();
}

export async function addAlbum(album) {
  return await db.albums.add(album);
}

export async function updateAlbum(album) {
  return await db.albums.update(+album.id, album);
}

export async function getLastId() {
  const album = await db.albums.toCollection().last();
  return album ? album.id : -1;
}

export async function deleteAlbum(albumId) {
  return await db.albums.delete(albumId);
}


export default db;