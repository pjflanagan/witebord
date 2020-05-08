import { Room } from './room.js';
import { getRoomId } from '../shared/roomHelpers.js';
import { EVENTS } from '../shared/socketHelpers.js';

// https://socket.io/docs/emit-cheatsheet/

class ServerSocket {
	constructor(io) {
		this.rooms = {};
		this.users = {};

		this.io = io;
		this.io.on(EVENTS.connect, (socket) => {
			const self = this;
			self.recvJoin(socket);

			socket.on(EVENTS.disconnect, () => self.recvLeave(socket));
			socket.on(EVENTS.draw, (data) => self.recvDraw(socket, data));
			socket.on(EVENTS.move, (data) => self.recvMove(socket, data));
		});
	}

	log({ action, userId, roomId }) {
		const users = Object.keys(this.users).length;
		const rooms = Object.keys(this.rooms).length;
		console.log(`users: ${users} | rooms: ${rooms} | ${action} ${userId}[${roomId}]`);
	}

	// -------------------------------------------------------------------------

	// add a user with given id
	addUser(userId, roomId) {
		if (!this.rooms[roomId]) {
			this.addRoom(roomId);
		}
		this.users[userId] = roomId;
	}

	// add a room with given id
	addRoom(roomId) {
		this.rooms[roomId] = new Room(this, roomId);
	}

	// remove a user by the user id
	removeUser(userId) {
		delete this.users[userId];
	}

	// remove a room by the room id
	removeRoom(roomId) {
		delete this.rooms[roomId];
	}

	// get a room by a user id
	getRoom(userId) {
		const roomId = this.users[userId];
		if (!this.rooms[roomId]) {
			this.addRoom(roomId);
		}
		return this.rooms[roomId];
	}

	// -------------------------------------------------------------------------

	// connect
	recvJoin(socket) {
		const roomId = getRoomId(socket.handshake.query.roomId);
		const userId = socket.id;

		this.addUser(userId, roomId);

		const room = this.getRoom(userId);
		room.join(socket);

		this.log({ action: 'add', userId, roomId });
	}

	// disconnect
	recvLeave(socket) {
		const room = this.getRoom(socket.id);
		const userId = socket.id;
		const roomId = room.roomId;
		this.removeUser(userId);
		room.leave(socket);

		this.log({ action: 'del', userId, roomId });
	}

	recvDraw(socket, data) {
		const room = this.getRoom(socket.id);
		room.sendDraw(socket, data);
	}

	recvMove(socket, data) {
		const room = this.getRoom(socket.id);
		room.sendMove(socket, data);
	}

	// -------------------------------------------------------------------------
}

export { ServerSocket }