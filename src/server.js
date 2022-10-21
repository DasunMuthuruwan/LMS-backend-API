// config dot env
import 'dotenv/config'
import express from "express"
import cors from 'cors'
import logger from './utils/logger'
import { connect } from './utils/db.conn'
import { googleAuth } from './configs/google.auth'
import passport from 'passport'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import config from './configs'
import { routesInit } from './api/routes'

// configure express
const app = express()
const PORT = process.env.PORT || 8090

// set middleware
// access frontend url only retrict another url (we can add array url)
// app.use(cors({origin: "http://localhost:3000"}))
app.use(cors())
app.use(express.json({ limit: "20mb" }))

// create session
app.use(session({
    secret: config.SESSION_SECRET,
    // force race conditions, session validate only not modify request
    resave: false,
    saveUninitialized: false,
    // session store collection create in db
    store: MongoStore.create({ mongoUrl: config.DB_CONNECTION_STRING }),
    cookie: {
        secure: false,
        // expire cookie after 10 seconds
        expires: new Date(Date.now() + 10000),
        maxAge: 10000
    }
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res, next) => {
    res.send("<a href='http://localhost:8090/auth/google'>Login</a>")
})

app.listen(PORT, () => {
    logger.info(`Server is up and running on ${PORT}`);
    // connect to db
    connect()
    routesInit(app, passport)
    googleAuth(passport)
})
