'use strict';

// https://github.com/riebel/socketio-es6-starter

import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';
import path from 'path';
import bodyParser from 'body-parser';
import { ServerSocket } from './socket.js';
import { getRoomId } from '../shared/roomHelpers.js';
import { load, save } from './storage.js';
import { read } from 'fs';
// import compression from 'compression';

const app = express();
const server = http.Server(app);
const io = new SocketIO(server);
const port = process.env.PORT || 3000;
const serverSocket = new ServerSocket(io);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

app.get('/', function (req, res) {
	res.render('index');
});

app.get('/:pageValue', function (req, res) {
	const unformattedPage = req.params.pageValue;
	if (unformattedPage === 'favicon.ico') {
		return;
	}
	const roomId = getRoomId(unformattedPage);
	serverSocket.addRoom(roomId);

	res.render('bord');
});

app.get('/:pageValue/load', function (req, res) {
	console.log('load');
	const unformattedPage = req.params.pageValue;
	const roomId = getRoomId(unformattedPage);
	return load(roomId);
});

app.post('/:pageValue/save', function (req, res) {
	console.log('save');
	const unformattedPage = req.params.pageValue;
	const roomId = getRoomId(unformattedPage);

	console.log(req.body);

	// const img = req.Body.img;
	// save(roomId, img);

	res.json({ result: 'done' });
});

// app.use(compression({}));
app.use('/client', express.static(path.resolve(__dirname + '/../client')));
app.use('/shared', express.static(path.resolve(__dirname + '/../shared')));

// TODO: make a debug option so you can test on multiple computers
// https://stackoverflow.com/questions/30712141/connect-to-localhost3000-from-another-computer-expressjs-nodejs
server.listen(port, () => {
	console.log(`port *: ${port}`);
});