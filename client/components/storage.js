import { SAVE_DELAY, SAVE_STATES } from './const.js';

// TODO: on resize get data here

class Storage {
	constructor({ canvas, roomId }) {
		this.canvas = canvas;
		this.roomId = roomId
		this.timeout = 0;
		this.saving = SAVE_STATES.canceled;
	}

	cancel() {
		clearTimeout(this.timeout);
		this.saving = SAVE_STATES.canceled;
	}

	queue() {
		this.cancel();
		const self = this;
		this.saving = SAVE_STATES.saving;
		this.timeout = setTimeout(function () {
			self.save();
		}, SAVE_DELAY);
	}

	save() {
		const img = this.canvas.toImage();

		this.canvas.copyToClipboard();

		// var formData = new FormData();
		// var blob = new Blob([img], { type: 'image/png' });
		// formData.append('img', blob);
		// var request = new XMLHttpRequest();
		// request.open('POST', `/${this.roomId}/save`);
		// request.send(formData);

		// $.ajax({
		// 	url: `/${this.roomId}/save`,
		// 	type: 'POST',
		// 	data: { img: 'hey' },
		// 	contentType: false,
		// 	cache: false,
		// 	processData: false,
		// 	beforeSend: function () {
		// 		console.log('sending');
		// 	},
		// 	success: function (data) {
		// 		console.log('sent!');
		// 		this.saving = SAVE_STATES.saved;
		// 	},
		// 	error: function (e) {
		// 		console.log('error');
		// 		this.saving = SAVE_STATES.error;
		// 	}
		// });
	}

	load() {

	}
}

export { Storage };