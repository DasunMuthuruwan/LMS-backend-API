import GoogleStrategy from 'passport-google-oauth20'
import config from './index'
import User from '../api/models/User.model'

const googleAuth = (passport) => {
    GoogleStrategy.Strategy
    passport.use(new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_REDIRECT_URL
    },
        async (accessToken, refreshToken, profile, callback) => {
            const userObj = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: profile.photos[0].value
            }
            // where googleID=profile.id
            let user = await User.findOne({ googleId: profile.id })

            if (user) {
                return callback(null, user)
            }

            User.create(userObj).then((user) => {
                return callback(null, user)
            }).catch((error) => {
                return callback(error.message)
            })

        }
    ))

    // serialize user
    passport.serializeUser((user, callback) => {
        callback(null, user.id);
    });
    // deserialize user
    passport.deserializeUser((id, callback) => {
        User.findById(id, (err, user) => {
            callback(err, user)
        })
    });
}

export { googleAuth };