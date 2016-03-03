(function() { "use strict";

	love.timer = {};

	love.update = love.update || function() {};

	var TICK_RATE = 1/30;

	love.timer.getTime = function() {
		return Date.now() / 1000; // To seconds
	};

	var _last = 0, _dif = 0, _fps = 0, _acc = 0;

	love.timer.init = function(now) {
		_last = now;
	};

	love.timer.step = function(now) {
		_dif = (now - _last)/1000;
		_last = now;
		if (_dif <= 0) return;
		_fps = (1/_dif)*0.1 + _fps*0.9;

		_acc += Math.min(_dif, TICK_RATE);
		while (_acc >= TICK_RATE) {
			love.update(TICK_RATE);
			_acc -= TICK_RATE;
		}
	};

	love.timer.getDelta = function() {
		return _dif;
	};

	love.timer.getFPS = function() {
		return _fps;
	};

})();