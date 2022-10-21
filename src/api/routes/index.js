import { authenticate } from "../middleware/auth.middleware";

const routesInit = (app, passport) => {
    // passport.authenticate is middleware
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
    app.get('/auth/google/callback', passport.authenticate("google", {
        failureRedirect: '/login',
        successRedirect: '/user'
    }), (req, res) => {
        // successful authenticate
        console.log('user authenticated');
    })
    app.get('/test', authenticate, (req, res) => {
        res.send('<h3>User is authenticated</3>')
    })
}


export { routesInit }