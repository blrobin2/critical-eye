require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

app.use(
  "/static",
  express.static(path.join(__dirname, "client", "build", "static"))
);

app.get("/", function(req, res) {
  res.sendFile("client/build/index.html", { root: __dirname });
});

app.get("/search", async (req, res) => {
  const access = await spotifyApi.clientCredentialsGrant();
  await spotifyApi.setAccessToken(access.body.access_token);

  const albums = await spotifyApi.searchAlbums(req.query.q);
  res.json({ albums: albums.body.albums });
});

app.get("/album/:spotifyId", async (req, res) => {
  const access = await spotifyApi.clientCredentialsGrant();
  await spotifyApi.setAccessToken(access.body.access_token);

  const album = await spotifyApi.getAlbum(req.params.spotifyId);
  res.json({ album: album.body });
});

app.listen(process.env.PORT || 8081);
