const path    = require('path')
const express = require('express')
const app     = express()
const SpotifyWebApi = require('spotify-web-api-node')
const config  = require('config')

const spotifyApi = new SpotifyWebApi({
  clientId: config.get('spotifyClientId'),
  clientSecret: config.get('spotifyClientSecret')
})

let access_token = ''

app.use(express.static('public'))
app.use(express.static(__dirname + '/client/build'))

app.get('/', function (req, res) {
  spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body.access_token)
    access_token = data.body.access_token
    console.log('TOKEN GRANTED');
    res.sendFile('client/build/index.html', {root: __dirname})
  }, err => {
    console.error(err)
  })
})

app.get('/search', async (req, res) => {
  const access = await spotifyApi.clientCredentialsGrant();
  await spotifyApi.setAccessToken(access.body.access_token);

  const albums = await spotifyApi.searchAlbums(req.query.q);
  res.json({ albums: albums.body.albums });
});

app.get('/album/:spotifyId', async (req, res) => {
  const access = await spotifyApi.clientCredentialsGrant();
  await spotifyApi.setAccessToken(access.body.access_token);

  const album = await spotifyApi.getAlbum(req.params.spotifyId);
  res.json({ album: album.body });
});

app.listen(process.env.PORT || 8081);