import { COLORS } from '../components/const.js';
import { Canvas } from '../components/canvas.js';
import { ClientSocket } from '../components/socket.js';
import { Brushes } from '../components/brush.js';
import { getPageFromUrl, getRoomTitle, getRoomId } from '../../shared/roomHelpers.js';
import { DEFAULT_COLOR } from '../components/const.js';
import { Storage } from '../components/storage.js';

angular.module('witebord').controller('witebordController', ['$scope', '$http', '$swipe', '$location', function ($scope, $http, $swipe, $location) { // $timeout

	/**
	 * Initializes the witebord 
	 * @method init
	 */
	$scope.init = function () {
		// room
		const url = window.location.href;
		const unformattedPage = getPageFromUrl(url);
		$scope.roomTitle = getRoomTitle(unformattedPage);
		$scope.roomId = getRoomId(unformattedPage);
		$location.path(`/${$scope.roomId}`);

		// defaults
		$scope.pallet(DEFAULT_COLOR);
		$scope.down = false;
		$scope.saveTimeout = 0;

		// initialize
		$scope.canvas = new Canvas();
		$scope.brushes = new Brushes($scope.canvas);
		$scope.storage = new Storage({ canvas: $scope.canvas, roomId: $scope.roomId });
		$scope.socket = new ClientSocket($scope);
	}

	$scope.strokeStart = function ({ offsetX, offsetY }) {
		$scope.down = true;
		$scope.canvas.strokeStart({ offsetX, offsetY });
		$scope.storage.cancel();
	}

	$scope.touchStart = function ($event) {
		const offsetX = $event.targetTouches[0].clientX;
		const offsetY = $event.targetTouches[0].clientY;
		$scope.strokeStart({ offsetX, offsetY });
	}

	$scope.stroke = function ({ offsetX, offsetY }) {
		if (!$scope.down) {
			$scope.socket.sendMove({ offsetX, offsetY, color: $scope.colorClass });
			return;
		}
		$scope.socket.sendDraw({ offsetX, offsetY, color: $scope.colorClass });
	}

	$scope.touchMove = function ($event) {
		const offsetX = $event.targetTouches[0].clientX;
		const offsetY = $event.targetTouches[0].clientY;
		$scope.stroke({ offsetX, offsetY });
	}

	$scope.strokeEnd = function () {
		$scope.down = false;
		$scope.canvas.strokeEnd();
		$scope.storage.queue();
	}

	$scope.pallet = function (color) {
		$scope.color = COLORS[color];
		$scope.colorClass = color;
	}

}]);