const { Router } = require("express");
const router = Router();

const spotifyApi = require("../spotifyApi");

router.get("/search", async (req, res) => {
  try {
    const albums = await spotifyApi.searchAlbums(req.query.q);
    res.json({ albums: albums.body.albums });
  } catch ({ message }) {
    res.json({ message });
  }
});

router.get("/:spotifyId", async (req, res) => {
  try {
    const album = await spotifyApi.getAlbum(req.params.spotifyId);
    res.json({ album: album.body });
  } catch ({ message }) {
    res.json({ message });
  }
});

module.exports = router;
