// config dot env
import  'dotenv/config'
import express from "express"
import cors from 'cors'
import logger from './utils/logger'

// configure express
const app = express()
const PORT = process.env.PORT || 8090

// set middleware
app.use(express.json({limit: "20mb"}))
// access frontend url only retrict another url (we can add array url)
// app.use(cors({origin: "http://localhost:3000"}))
app.use(cors())

app.get('/', (req, res, next) => {
    res.send('Hello')
    next()
})

app.listen(PORT, () => {
    logger.info(`Server is up and running on ${PORT}`);
})
