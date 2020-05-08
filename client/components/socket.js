import { DELAY, MY_BRUSH } from './const.js'
import { EVENTS } from '../../shared/socketHelpers.js';

class ClientSocket {

	// TODO: this might need $scope because I'll want to show user icons as they log in
	constructor(scope) {
		this.socket = io({
			query: {
				roomId: scope.roomId
			}
		});
		this.scope = scope;
		this.roomId = scope.roomId;
		this.canvas = scope.canvas;
		this.brushes = scope.brushes;
		this.storage = scope.storage;
		this.sendable = true;

		const self = this;
		// this.socket.on(EVENTS.join, (data) => self.recvJoin(data));
		this.socket.on(EVENTS.leave, (data) => self.recvLeave(data));
		this.socket.on(EVENTS.draw, (data) => self.recvDraw(data));
		this.socket.on(EVENTS.move, (data) => self.recvMove(data));
	}

	recvLeave(data) {
		this.brushes.remove(data.u);
		this.scope.$apply();
	}

	sendMove({ offsetX, offsetY, color }) {
		const data = this.canvas.preformatMove({ offsetX, offsetY, color });
		this.brushes.move({ x: data.x, y: data.y, c: data.c, u: MY_BRUSH });

		if (!this.sendable) {
			return;
		}

		this.socket.emit(EVENTS.move, data);

		this.throttle();
	}

	recvMove(data) {
		this.brushes.move(data);
		this.scope.$apply();
	}

	sendDraw({ offsetX, offsetY, color }) {
		const data = this.canvas.preformatDraw({ offsetX, offsetY, color });
		this.brushes.moveFromDraw({ x2: data.x2, y2: data.y2, c: data.c, u: MY_BRUSH });

		if (!this.sendable) {
			return;
		}

		this.socket.emit(EVENTS.draw, data);
		this.canvas.draw(data, true);

		this.throttle();
	}

	recvDraw(data) {
		this.storage.cancel();
		this.brushes.moveFromDraw(data);
		this.canvas.draw(data, false);
		this.scope.$apply();
	}

	throttle() {
		this.sendable = false;
		const self = this;
		setTimeout(function () {
			self.sendable = true;
		}, DELAY);
	}

}

export { ClientSocket };