(function() { "use strict";

	love.window = {};

	love.window.setMode = function(w, h) {
		love._canvas.width  = w;
		love._canvas.height = h;
	};

	love.window.setCaption = function(title) {
		document.title = title;
	};

})();