(function() { "use strict";

	love.mouse = {};

	var _x = 0, _y = 0, _b = {};


	love.mouse.getX = function() {
		return _x;
	};

	love.mouse.getY = function() {
		return _y;
	};

	love.mouse.getPosition = function() {
		return {
			x: _x,
			y: _y,
		};
	};

	love.mouse.setVisible = function(bool) {
		love._canvas.style.cursor = bool ? "auto" : "none";
	};

	love.mouse.isDown = function(button) {
		return _b.hasOwnProperty(button) && _b[button];
	};

	love.mousemoved = function() {};
	love.mousewheel = function() {};

	var _rect = love._canvas.getBoundingClientRect();

	love._canvas.addEventListener('mousemove', function love_mousemove(evt) {
		_x = evt.clientX - _rect.left;
		_y = evt.clientY - _rect.top;
		love.mousemoved(_x, _y);
	}, false);

	love.mouse._evtButton = function(evt) {
		switch (evt.button) {
			case 0:  return 'left';
			case 1:  return 'middle';
			case 2:  return 'right';
			default: return 'unknown';
		}
	};

	love.mousepressed  = love.mousepressed  || function() {};
	love.mousereleased = love.mousereleased || function() {};

	love._canvas.addEventListener('mousedown', function love_mousedown(evt) {
		var button = love.mouse._evtButton(evt);
		_b[button] = true;
		love.mousepressed(_x, _y, button);
	}, false);

	love._canvas.addEventListener('mouseup', function love_mouseup(evt) {
		var button = love.mouse._evtButton(evt);
		_b[button] = false;
		love.mousereleased(_x, _y, button);
	}, false);

	love._canvas.addEventListener('wheel', function love_mousewheel(evt) {
		love.mousewheel(evt.deltaX, evt.deltaY, evt.deltaZ);
	}, false);

})();