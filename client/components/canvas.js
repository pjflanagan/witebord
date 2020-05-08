import { SIZE, COLORS } from './const.js';

class Canvas {
	constructor() {
		this.canvas = document.getElementById('bord');
		this.ctx = this.canvas.getContext('2d');
		this.init();
		const self = this;

		$(window).resize(function () {
			self.ctx.save();
			self.init();
			self.ctx.restore();
		});
	}

	init() {
		this.W = $('#bord').width();
		this.H = $('#bord').height();

		this.canvas.width = this.W;
		this.canvas.height = this.H;

		// if (img) {
		// 	this.ctx.drawImage(img, 0, 0, this.W, this.H);
		// }
	}

	link(socket) {
		this.socket = socket;
	}

	preformatMove({ offsetX, offsetY, color }) {
		return {
			x: offsetX / this.W,
			y: offsetY / this.H,
			c: color
		};
	}

	unformat({ x, y }) {
		return {
			x: x * this.W,
			y: y * this.H
		};
	}

	preformatDraw({ offsetX, offsetY, color }) {
		return {
			x1: this.last.x,
			y1: this.last.y,
			x2: offsetX / this.W,
			y2: offsetY / this.H,
			c: color
		}
	}

	strokeStart({ offsetX, offsetY }) {
		this.last = { x: offsetX / this.W, y: offsetY / this.H };
	}

	// TODO: another user's offsetX and Y might be different
	// be sure to pass in percentageX and Y instead
	draw({ x1, x2, y1, y2, c }, update) {
		this.ctx.beginPath();
		this.ctx.moveTo(x1 * this.W, y1 * this.H);
		this.ctx.lineTo(x2 * this.W, y2 * this.H);
		this.ctx.lineWidth = (c === 'eraser') ? SIZE.eraser : SIZE.marker;
		this.ctx.strokeStyle = COLORS[c];
		this.ctx.stroke();
		if (update) {
			this.last = { x: x2, y: y2 }
		}
	}

	strokeEnd() {
		delete this.last;
	}

	toImage() {
		return this.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
	}

	copyToClipboard() {
		var img = document.createElement('img');
		img.src = this.toImage();
		document.body.appendChild(img);
		var r = document.createRange();
		r.setStartBefore(img);
		r.setEndAfter(img);
		r.selectNode(img);
		var sel = window.getSelection();
		sel.addRange(r);
		document.execCommand('Copy');
	}

}

export { Canvas };