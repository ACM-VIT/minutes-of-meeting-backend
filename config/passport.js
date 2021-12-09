const GoogleStrategy = require("passport-google-oauth20").Strategy;

const emails = require("./emails.json");

const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.GOOGLE_CALLBACK}`,
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
        };

        try {
          if (emails.email.includes(newUser.email)) {
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
              done(null, user);
            } else {
              user = await User.create(newUser);
              done(null, user);
            }
          } else {
            done(null, false);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
