import { EVENTS } from '../shared/socketHelpers.js';

class Room {
	constructor(server, roomId) {
		this.server = server;
		this.roomId = roomId;
		this.users = [];
	}

	// join

	join(socket) {
		socket.join(this.roomId);
		this.users.push(socket.id);
		this.sendJoin(socket);
	}

	sendJoin(socket) {
		socket.to(this.roomId).emit(EVENTS.join, { n: this.users.length });
	}

	// leave

	leave(socket) {
		// remove the user from the room
		socket.leave(this.roomId);
		this.users = this.users.filter((user) => (user != socket.id));

		// send the disconnect
		this.sendLeave(socket);

		// if there are no more users, delete the room
		if (this.users.length === 0) {
			this.server.removeRoom(this.roomId);
		}
	}

	sendLeave(socket) {
		socket.to(this.roomId).emit(EVENTS.leave, {
			u: socket.id,
			n: this.users.length
		});
	}

	// draw

	sendDraw(socket, data) {
		data.u = socket.id;
		socket.to(this.roomId).emit(EVENTS.draw, data);
	}

	// move

	sendMove(socket, data) {
		data.u = socket.id;
		socket.to(this.roomId).emit(EVENTS.move, data);
	}
}

export { Room };