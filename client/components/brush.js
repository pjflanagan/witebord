import { DEFAULT_COLOR, MY_BRUSH, COLORS } from './const.js';
import { isMobile } from '../packages/isMobile.js';

class Brush {
	constructor(userId) {
		this.color = DEFAULT_COLOR;
		this.position = {
			top: -10,
			left: -10
		};
		this.userId = userId;
	}

	move({ top, left, colorClass }) {
		this.color = colorClass;
		this.position = {
			'transform': `translate(${left}px, ${top}px)`
		};
	}
}

class Brushes {
	constructor(canvas) {
		this.brushes = {};
		this.canvas = canvas;
		this.isMobile = isMobile();

		if (!this.isMeAndMobile(MY_BRUSH)) {
			this.brushes[MY_BRUSH] = new Brush(MY_BRUSH);
		}
	}

	length() {
		return Object.keys(this.brushes).length;
	}

	isMeAndMobile(userId) {
		return userId === MY_BRUSH && this.isMobile;
	}

	move({ u, x, y, c }) {
		if (this.isMeAndMobile(u)) {
			return;
		} else if (!this.brushes[u]) {
			this.brushes[u] = new Brush(u);
		}
		const data = this.canvas.unformat({ x, y });
		this.brushes[u].move({
			left: data.x,
			top: data.y,
			colorClass: c
		});
	}

	moveFromDraw({ u, x2, y2, c }) {
		this.move({ u, x: x2, y: y2, c });
	}

	remove(userId) {
		delete this.brushes[userId];
	}

}

export { Brushes, Brush };