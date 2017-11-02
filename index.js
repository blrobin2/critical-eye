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
//app.use(express.static('views'))

app.get('/', function (req, res) {
  spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body.access_token)
    access_token = data.body.access_token
    res.sendFile('views/index.html', {root: __dirname})
  }, err => {
    console.error(err)
  })
})

app.get('/search', (req, res) => {
  if (! access_token) {
    res.json({message: 'Please wait for authentication. If the page has been sitting awhile, try refreshing the page'})
    return
  }

  spotifyApi.searchAlbums(req.query.q).then(albums => {
    res.json({albums: albums.body.albums})
  }, err => {
    console.error(err)
  })
})

app.listen(process.env.PORT || 8080)