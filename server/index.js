import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';
import router from './router/route.js';
import path from 'path';

const app = express();
const __dirname = path.resolve();

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.disable("x-powered-by");

const port = 8080;

app.get('/', (req, res) => {
    res.status(201).json("GET Request")
})

app.use('/api', router)

app.use('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})


connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Connected to http://localhost:${port}`)
        })
    } catch (error) {
        console.log('Cannot connect to server')
    }
}).catch(error => {
    console.log("Invalid Database Connection")
})