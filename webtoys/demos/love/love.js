(function() { "use strict";

	var TICK_RATE = 1/30;
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
			love._timerId = setTimeout(love.run, 0);
		}
	};

	window.onload = function() {
		love._canvas  = document.getElementById("love");
		love._context = love._canvas.getContext("2d");
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

	var acc = 0;
	love.run = function() {
		love.timer.step();
		acc += love.timer.getDelta();
		while (acc >= TICK_RATE) {
			love.update(TICK_RATE);
			acc -= TICK_RATE;
		}

		love.graphics.clear();
		love.draw();
		love._timerId = setTimeout(love.run, 1000*TICK_RATE);
	};

	love.load  	= function() {};
	love.update	= function() {};
	love.draw  	= function() {};
	love.quit  	= function() {};

	love._exit = function() {
		if (love.quit()) return false;
		clearTimeout(love._timerId);
		return true;
	};

})();