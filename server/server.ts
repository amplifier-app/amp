import express from "express";
import * as path from "path";
import http from "http";
import sockets from "./sockets";
import { auth } from 'express-openid-connect';
// import cors from "cors"; // <- if you use this, npm install cors
require('dotenv').config()

const port = process.env.PORT || 3000;
const app = express();

// Setup Json, Static
app.use(express.json());
app.use(auth({
	routes: {
		postLogoutRedirect: 'https://amplifier.community/',
	}
}));
app.use(express.static(path.join(__dirname, "./public")));
// app.use(cors());

// Add Socket.io
const server = http.createServer(app);

var io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

//Add Routes
const routes = require("./routes");
app.use("/api/v1/", routes);

//Add Socket Routes
sockets(io);

app.get('*', function (req, res) {
	res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.set('trust proxy', true);
// Start Server
server.listen(port, function () {
	// eslint-disable-next-line no-console
	console.log("Listening on port", port);
});
