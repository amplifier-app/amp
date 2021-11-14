import { Socket } from "socket.io";
import ParticipantConnection, { SocketConfig } from "./ParticipantConnection";
import { auth, requiresAuth } from 'express-openid-connect';
var cookieParserSocket = require('socket.io-cookie-parser');
var cookieParser = require('cookie-parser');


// Set up the socket endpoints
function setupSockets(io: Socket) {
    // Middleware to get Participant ID on initial connection
    io.use(cookieParserSocket(process.env.SECRET));
    io.use(authorization);

    function authorization(socket, next) {
        // cookies are available in:
        // 1. socket.request.cookies
        // 2. socket.request.signedCookies (if using a secret)
        // console.log('Cookies: ', socket.request.cookies.appSession)
        // console.log(cookieParser.signedCookie(socket.request.cookies.appSession, process.env.SECRET));
        next()
    }


    //Create a new participant on connection
    io.on('connection', (socket: any) => {
        // console.log("Socket Handshake:", socket.handshake.headers.cookie);
        const socketConfig: SocketConfig = {
            roomId: socket.request._query['roomId'],
            dailyCoId: socket.request._query['participantId'],
            name: socket.request._query['name'],
            company: socket.request._query['company'],
            title: socket.request._query['title'],
            sub: socket.request._query['sub'],
            picture: socket.request._query['picture'],
            email: socket.request._query['email'],
            given_name: socket.request._query['given_name'],
            family_name: socket.request._query['family_name'],
            nickname: socket.request._query['nickname'],
        }
        new ParticipantConnection(socket, io, socketConfig);
    });
};

export default setupSockets;