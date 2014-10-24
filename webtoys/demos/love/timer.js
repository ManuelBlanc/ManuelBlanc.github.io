(function() { "use strict";

	love.timer = {};

	love.timer.getTime = function() {
		return Date.now() / 1000; // To seconds
	};

	var _last = love.timer.getTime(), _dif = 0;
	love.timer.step = function() {
		var now = love.timer.getTime();
		_dif = now - _last;
		_last = now;
	};

	love.timer.getDelta = function() {
		return _dif;
	};

	love.timer.getFPS = function() {
		return 0;
	};

})();