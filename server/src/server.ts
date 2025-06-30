import http from "http";
import app from "./app";

const server = http.createServer(app);

server.listen(5000, () => {
    console.log("Server running on Port: 5000");
})