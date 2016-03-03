(function() { "use strict";

	love.keyboard = {};

	// Make the canvas focusable
	love._canvas.setAttribute('tabindex', '1');
	love._canvas.focus();

	var _b = {};

	love.keyboard.isDown = function(key) {
		return _b.hasOwnProperty(key) && _b[key];
	};

	love.keypressed  = love.keypressed  || function() {};
	love.keyreleased = love.keyreleased || function() {};

	var _keyNames = {
		37 	: "left",
		38 	: "up",
		39 	: "right",
		40 	: "down",
		45 	: "insert",
		46 	: "delete",
		8  	: "backspace",
		9  	: "tab",
		13 	: "enter",
		16 	: "shift",
		17 	: "ctrl",
		18 	: "alt",
		19 	: "pause",
		20 	: "capslock",
		27 	: "escape",
		32 	: " ",
		33 	: "pageup",
		34 	: "pagedown",
		35 	: "end",
		112	: "f1",
		113	: "f2",
		114	: "f3",
		115	: "f4",
		116	: "f5",
		117	: "f6",
		118	: "f7",
		119	: "f8",
		120	: "f9",
		121	: "f10",
		122	: "f11",
		123	: "f12",
		144	: "numlock",
		145	: "scrolllock",
		186	: ";",
		187	: "=",
		188	: ",",
		189	: "-",
		190	: ".",
		191	: "/",
		192	: "`",
		219	: "[",
		220	: "\\",
		221	: "]",
		222	: "\'"
	};

	var _getKeyname = function(evt) {
		var c = evt.keyCode;
		if (_keyNames[c]) return _keyNames[c];
		if (c >= 48 && c <= 57) return (c - 48).toString();
		if (c >= 65 && c <= 90) return String.fromCharCode(c + 32);
		return "unknown";
	};

	love._canvas.addEventListener("keydown", function love_keydown(evt) {
		var chr = _getKeyname(evt);
		_b[chr] = true;
		love.keypressed(chr);
		evt.preventDefault();
	}, false);
	love._canvas.addEventListener("keyup", function love_keyup(evt) {
		var chr = _getKeyname(evt);
		_b[chr] = false;
		love.keyreleased(chr);
		evt.preventDefault();
	}, false);

})();