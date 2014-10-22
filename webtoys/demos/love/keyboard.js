(function() { "use strict";

	love.keyboard = {};

	var _b = {};

	love.keyboard.isDown = function(key) {
		return _b.hasOwnProperty(_b) && _b[key];
	};

	love._canvas.addEventListener("keydown", function love_keydown(evt) {
		evt = null;
	}, false);
	love._canvas.addEventListener("keyup", function love_keyup(evt) {
		evt = null;
	}, false);

})();