import express from "express"
import { Server } from "http";
import { getDBConnection } from "./database";
import { getEvent } from "./api";
const app = express()


export const start = async (): Promise<Server> => new Promise(async (resolve, reject) => {
    try {
        const port = 4040
        getDBConnection()
        app.get('/', (req, res) => {
            res.send('Hello World!')
        })

        const server = app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
            resolve(server)
        })
    } catch (err) {
        reject(err)
    }
})

app.get('/events', async (req, res) => {
    res.send(await getEvent())
})

app.get('/events/:id', async (req, res) => {
    res.send(await getEvent(req.params.id))
})