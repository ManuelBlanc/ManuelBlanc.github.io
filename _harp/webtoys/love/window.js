(function() { "use strict";

	love.window = {};

	love.window.setMode = function(w, h) {
		love._canvas.width  = w;
		love._canvas.height = h;
	};

	love.window.getWidth = function() {
		return love._canvas.width ;
	};

	love.window.getHeight = function() {
		return love._canvas.height;
	};

	love.window.setCaption = function(title) {
		document.title = title;
	};

	love.window.isFullscreen = function() {
		return (document.fullscreenElement == love._canvas);
	};

	love.window.setFullscreen = function(bool) {
		if (bool) {
			if (!document.fullscreenEnabled) {
				throw new Error("document.fullscreenEnabled is false");
			}
			love._canvas.requestFullscreen();
		}
		else {
			exitFullscreen();
		}
	};

})();