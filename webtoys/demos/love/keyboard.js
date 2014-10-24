(function() { "use strict";

	love.keyboard = {};

	// Make the canvas focusable
	love._canvas.setAttribute('tabindex', '1');
	love._canvas.focus();

	var _b = {};

	love.keyboard.isDown = function(key) {
		return _b.hasOwnProperty(_b) && _b[key];
	};

	love.keypressed  = love.keypressed  || function() {};
	love.keyreleased = love.keyreleased || function() {};

	love._canvas.addEventListener("keydown", function love_keydown(evt) {
		var chr = String.fromCharCode(evt.keyCode);
		_b[chr] = true;
		love.keypressed(chr);
	}, false);
	love._canvas.addEventListener("keyup", function love_keyup(evt) {
		var chr = String.fromCharCode(evt.keyCode);
		_b[chr] = false;
		love.keyreleased(chr);
	}, false);

})();