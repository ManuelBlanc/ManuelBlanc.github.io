var STAR_COUNT	= 256;
var FOV       	= 500;
var DRAW_STYLE	= 'circle';
var DEPTH     	= 1000;
var MAX_SPEED 	= 5;
var SH_WIDTH, SH_HEIGHT; // init in load.load

var random = function(min, max) {
	return min + (max - min) * Math.random();
};

var stars;
var palette;

var Star = function() {
	this.randomize();
	this.z = 1 + random(0, DEPTH);
};

Star.prototype.randomize = function() {
	this.x = random(-SH_WIDTH,  SH_WIDTH );
	this.y = random(-SH_HEIGHT, SH_HEIGHT);
	this.r = Math.sqrt(this.x*this.x + this.y*this.y);
	this.z = DEPTH;
	this.zv = random(0.5, 1) * MAX_SPEED;
	this.update(0);
};

Star.prototype.update = function(dt) {
	this.x = this.r * Math.cos(love.timer.getTime()*this.zv / 20);
	this.y = this.r * Math.sin(love.timer.getTime()*this.zv / 20);

	this.z  = this.z - this.zv*60*dt;
	this.sx = this.x / this.z * FOV;
	this.sy = this.y / this.z * FOV;
};

Star.prototype.draw = function(sx, sy) {
	var b = Math.floor(256 * (1 - this.z / DEPTH) * (this.zv / MAX_SPEED));
	love.graphics.setStringColor(palette[b]);
	if (DRAW_STYLE === 'circle') {
		love.graphics.circle('fill', this.sx, this.sy, 1);
	}
	else {
		love.graphics[DRAW_STYLE](this.sx, this.sy, sx, sy);
	}
};

love.load = function() {
	var i;
	SH_WIDTH  = 0.5*love.window.getWidth();
	SH_HEIGHT = 0.5*love.window.getHeight();
	stars = {};
	for (i=0; i < STAR_COUNT; i++) {
		stars[i] = new Star();
	}

	palette = [];
	for (i=0; i <= 255; i++) {
		palette[i] = love.graphics.newColor(i, i, i);
	}
};

love.draw = function() {
	love.graphics.translate(SH_WIDTH, SH_HEIGHT);

	for (var i=0; i < STAR_COUNT; i++) {
		var star = stars[i];
		// Move star
		var sx = star.sx, sy = star.sy;
		star.update(1/60);
		// Redraw
		star.draw(sx, sy);
		// Reset if needed
		if (sx*sx > SH_WIDTH*SH_WIDTH || sy*sy > SH_HEIGHT*SH_HEIGHT || star.z < 1) {
			star.randomize();
		}
	}

	love.graphics.reset();

	love.graphics.setStringColor(palette[127]);
	love.graphics.print(Math.floor(love.timer.getFPS()) + 'FPS', 10, 10);
};

/*
love.keypressed = function(a, b, c) {
	if (a == 'enter') {
		love.keypressed = function() {};
		var element = love._canvas;
		var top = 0, left = 0;
		do {
			top  += element.offsetTop  || 0;
			left += element.offsetLeft || 0;
			element = element.offsetParent;
		} while (element);

		element = document.createElement('div');
		element.style.minWidth  = "800px";
		element.style.minHeight = "600px";
		love._canvas.parentNode.appendChild(element);
		love._canvas.parentNode.removeChild(love._canvas);
		document.body.appendChild(love._canvas);
		love._canvas.style.zIndex     = 2000;
		love._canvas.style.position   = 'absolute';
		//love._canvas.style.top        = top;
		//love._canvas.style.left       = left;
		//love._canvas.style.transition = "all 2s";
		love._canvas.style.top        = 0;
		love._canvas.style.left       = 0;
		love._canvas.style.width      = window.innerHeight;
		love._canvas.style.height     = window.innerWidth;
		love.window.setMode(window.innerWidth, window.innerHeight);
	}
};
*/