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

	var keyCode2Name = function(keyCode) {
		switch (keyCode) {
			case 13: return "enter";
			case 38: return "up";
			case 40: return "down";
			case 39: return "right";
			case 37: return "left";
			case 27: return "esc";
			case 32: return " ";
			case 17: return "ctrl";
			case 18: return "alt";
			case 16: return "shift";
			default: return String.fromCharCode(keyCode);
		}
	};

	love._canvas.addEventListener("keydown", function love_keydown(evt) {
		var chr = keyCode2Name(evt.keyCode);
		_b[chr] = true;
		love.keypressed(chr);
		evt.preventDefault();
	}, false);
	love._canvas.addEventListener("keyup", function love_keyup(evt) {
		var chr = keyCode2Name(evt.keyCode);
		_b[chr] = false;
		love.keyreleased(chr);
		evt.preventDefault();
	}, false);

})();