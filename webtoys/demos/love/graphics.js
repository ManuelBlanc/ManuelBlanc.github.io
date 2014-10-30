(function() { "use strict";

	love.graphics = {};

	love.graphics.scale = function(sx, sy) {
		love._context.scale(sx, sy);
	};

	love.graphics.setAlpha = function(alpha) {
		love._context.globalAlpha = alpha/255;
	};

	love.graphics.clear = function() {
		love._context.clearRect(0, 0, love._canvas.width, love._canvas.height);
	};

	// Converts HSL to RGB. (input and output range: 0 - 255)
	love.graphics.newColorHSL = function(h, s, l, a) {
		a = a || 255;
		if (s <= 0) return love.graphics.newColor(l, l, l, a);
		h  = h / 256 * 6;
		s /= 255;
		l /= 255;
		var c = (1-Math.abs(2*l-1))*s;
		var x = (1-Math.abs(h%2-1))*c;
		var m = (l-0.5*c), r = 0, g = 0, b = 0;
		     if (h < 1)	{ r = c; g = x; b = 0; }
		else if (h < 2)	{ r = x; g = c; b = 0; }
		else if (h < 3)	{ r = 0; g = c; b = x; }
		else if (h < 4)	{ r = 0; g = x; b = c; }
		else if (h < 5)	{ r = x; g = 0; b = c; }
		else           	{ r = c; g = 0; b = x; }
		return love.graphics.newColor(
			Math.round((r+m)*255), Math.round((g+m)*255), Math.round((b+m)*255), a
		);
	};

	love.graphics.newColor = function(r, g, b, a) {
		a = (typeof a !== "undefined") ? a/255 : 1;
		return "rgb(" + r + "," + g + "," + b + ")";
	};

	love.graphics.setStringColor = function(colStr) {
		love._context.strokeStyle = colStr;
		love._context.fillStyle   = colStr;
	};

	love.graphics.setBlendMode = function(mode) {
		love._context.globalCompositeOperation = mode;
	};

	love.graphics.setColor = function(r, g, b) {
		love.graphics.setStringColor(love.graphics.newColor(r, g, b));
	};

	love.graphics.setBackgroundColor = function(r, g, b) {
		love._canvas.style.backgroundColor = love.graphics.newColor(r, g, b);
	};

	love.graphics.setLineWidth = function(width) {
		love._context.strokeWidth = width;
	};

	love.graphics.rectangle = function(mode, x, y, w, h) {
		switch (mode) {
			case "fill": love._context.fillRect(x, y, w, h); break;
			case "line": love._context.strokeRect(x, y, w, h); break;
			default: throw new Error("invalid mode (" + mode + ")");
		}
	};

	love.graphics.line = function(x0, y0, x1, y1) {
		var pts = x0;
		if (pts instanceof Array) {
			var len = pts.length;
			if (len % 2 !== 0) throw new Error('not a multiple of two (' + len + ')');
			love._context.beginPath();
			love._context.moveTo(pts[0], pts[1]);
			for (var i=2; i < pts.length; i+=2) {
				love._context.lineTo(pts[i], pts[i+1]);
			}
			love._context.stroke();
			return;
		}

		love._context.beginPath();
		love._context.moveTo(x0, y0);
		love._context.lineTo(x1, y1);
		love._context.stroke();
	};

	love.graphics.circle = function(mode, x, y, r) {
		love._context.beginPath();
		love._context.arc(x, y, r, 0, 2*Math.PI, false);
		if (mode == "fill") love._context.fill();
		love._context.stroke();
	};

	love._context.textBaseline = "top";
	love._context.textAlign    = "left";

	love.graphics.setTextAlign = function(alignment) {
		love._context.textAlign = alignment;
	};

	love.graphics.print = function(text, x, y) {
		love._context.fillText(text, x, y);
	};

})();