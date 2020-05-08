// https://github.com/nglar/ngTouch/blob/master/src/ngTouch.js
const app = angular.module('witebord', ['ngTouch']).config(function ($locationProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false,
		rewriteLinks: false
	});
}).directive("ngTouchstart", function () {
	return {
		controller: ["$scope", "$element", function ($scope, $element) {

			$element.bind("touchstart", onTouchStart);
			function onTouchStart(event) {
				var method = $element.attr("ng-touchstart");
				$scope.$event = event;
				$scope.$apply(method);
			}

		}]
	}
}).directive("ngTouchmove", function () {
	return {
		controller: ["$scope", "$element", function ($scope, $element) {

			$element.bind("touchstart", onTouchStart);
			function onTouchStart(event) {
				event.preventDefault();
				$element.bind("touchmove", onTouchMove);
				$element.bind("touchend", onTouchEnd);
			}
			function onTouchMove(event) {
				var method = $element.attr("ng-touchmove");
				$scope.$event = event;
				$scope.$apply(method);
			}
			function onTouchEnd(event) {
				event.preventDefault();
				$element.unbind("touchmove", onTouchMove);
				$element.unbind("touchend", onTouchEnd);
			}

		}]
	}
}).directive("ngTouchend", function () {
	return {
		controller: ["$scope", "$element", function ($scope, $element) {

			$element.bind("touchend", onTouchEnd);
			function onTouchEnd(event) {
				var method = $element.attr("ng-touchend");
				$scope.$event = event;
				$scope.$apply(method);
			}

		}]
	}
}).directive("ngTap", function () {
	return {
		controller: ["$scope", "$element", function ($scope, $element) {

			var moved = false;
			$element.bind("touchstart", onTouchStart);
			function onTouchStart(event) {
				$element.bind("touchmove", onTouchMove);
				$element.bind("touchend", onTouchEnd);
			}
			function onTouchMove(event) {
				moved = true;
			}
			function onTouchEnd(event) {
				$element.unbind("touchmove", onTouchMove);
				$element.unbind("touchend", onTouchEnd);
				if (!moved) {
					var method = $element.attr("ng-tap");
					$scope.$apply(method);
				}
			}

		}]
	}
});
