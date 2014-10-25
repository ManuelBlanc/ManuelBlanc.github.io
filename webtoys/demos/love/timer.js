(function() { "use strict";

	love.timer = {};

	love.timer.getTime = function() {
		return Date.now() / 1000; // To seconds
	};

	var _last = 0, _dif = 0, _fps = 0;

	love.timer.init = function(now) {
		_last = now;
	};

	love.timer.step = function(now) {
		_dif = now - _last;
		_last = now;
		if (_dif <= 0) return;
		_fps = (1000/_dif)*0.9 + _fps*0.1;
	};

	love.timer.getDelta = function() {
		return _dif;
	};

	love.timer.getFPS = function() {
		return _fps;
	};

})();