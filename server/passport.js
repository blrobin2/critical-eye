const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;

const User = require("./models/User");
const spotifyApi = require("./spotifyApi");

passport.serializeUser(([user, err], done) => {
  done(err, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user, err) => {
    done(err, user);
  });
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.HOST_URL + "auth/spotify/callback/"
    },
    (accessToken, refreshToken, expires_in, profile, done) => {
      console.log(expires_in);
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.setRefreshToken(refreshToken);

      User.findOrCreate({
        where: { spotifyId: profile.id },
        defaults: {
          name: profile.displayName
        }
      }).then((user, err) => {
        done(err, user);
      });
    }
  )
);

module.exports = passport;
