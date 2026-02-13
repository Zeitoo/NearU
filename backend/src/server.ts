import http from "http"
import createApp from "./app"

export default function startServer () {
    const app = createApp()
    const server = http.createServer(app)

    server.listen(3000, () => {
        console.log("Server started at http://localhost:3000")
    })
    
}