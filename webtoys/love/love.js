(function() { "use strict";

	var modules = ["event","graphics","keyboard","mouse","timer","window"];

	window.love = {};
	love._canvas  = null;
	love._context = null;
	love._timerId = null;

	var init = function() {
		if (modules.length > 0) {
			var m = "love." + modules.pop();
			console.log("Loading " + m + " ...");
			love._require(m, init);
		}
		else {
			console.log("Done! Starting game.");
			love.load();
			requestAnimationFrame(function(now) {
				love.timer.init(now);
				requestAnimationFrame(love.run);
			});
		}
	};

	window.onload = function() {
		love._canvas  = document.getElementById("love");
		love._context = (love._canvas.getContext && love._canvas.getContext("2d"));
		if (!love._context) {
			// #nolove element remains visible
			throw new Error("HTML5 canvas is not supported.");
		}
		var nolove = document.getElementById("nolove");
		if (nolove) nolove.style.display = "none";
		init();
	};

	love._require = function(path, callback) {
		var js = document.createElement("script");
		js.type = "text/javascript";
		js.src  = path.replace(".", "/") + ".js";
		js.defer = true;
		js.onreadystatechange = callback;
		js.onload = callback;
		document.getElementsByTagName("head")[0].appendChild(js);
	};

	love.run = function(now) {
		love._timerId = requestAnimationFrame(love.run);
		love.timer.step(now);

		love.graphics.clear();
		love.draw();

	};

	love.load = love.load || function() {};
	love.draw = love.draw || function() {};
	love.quit = love.quit || function() {};

	love._exit = function() {
		if (love.quit()) return false;
		cancelAnimationFrame(love._timerId);
		return true;
	};

})();