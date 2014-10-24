// Consts
var W = 80;
var H = 60;
var S = 10;

var palette;

// Conf
var mw = 5, mh = 5;
var drawGrid = false;

var grid_last, grid_curr, grid_next;

var curSetup = 0;
var waveSetups = [
	function(x, y, v) { return v; },
	function(x, y, v) {
		var mx = Math.floor(love.mouse.getX()/S);
		var my = Math.floor(love.mouse.getY()/S);
		if (Math.pow(8-x, 2) + Math.pow(24-y, 2) < 4) {
			return Math.cos(love.timer.getTime());
		}
		return v;
	},
	function(x, y, v) {
		if (x === 0) return Math.cos(love.timer.getTime());
		return v;
	},
	function(x, y, v) {
		if (x === 0 || x === W-1) return Math.cos(love.timer.getTime());
		return v;
	}
];

love.load = function() {
	love.window.setMode(W*S, H*S);
	love.mouse.setVisible(false);

	if (palette === undefined) {
		palette = [];
		for (var i=0; i <= 2*255; i++) {
			var v = i - 255;
			palette[i] = love.graphics.newColor(Math.max(0, -v), 0, Math.max(0, v));
		}
	}

	grid_curr = new Grid(W, H);
	grid_last = grid_next = new Grid(W, H);
	// Last and next are aliased
};

var round = function(n) {
	return n > 0 ? Math.floor(n) : Math.ceil(n);
};

var setRect = function(x, y, w, h, val) {
	for (var i = 0; i < w; i++) {
		for (var j = 0; j < h; j++) {
			grid_last.set(x+i, y+j, val);
		}
	}
};

love.update = function(dt) {
	var x, y;
	// Mouse editing
	var mx = Math.floor(love.mouse.getX()/S);
	var my = Math.floor(love.mouse.getY()/S);
	     if (love.mouse.isDown('left' )) setRect(mx, my, mw, mh,  1);
	else if (love.mouse.isDown('right')) setRect(mx, my, mw, mh, -1);

	// Pausing
	if (love.keyboard.isDown(' ')) return;

	var t = love.timer.getTime();

	grid_curr.map(waveSetups[curSetup]);

	// Updating cells
	grid_curr.each(function(x, y, v) {
		var neigh = grid_curr.neighbours(x, y);
		var vx = neigh[1][0] - 2*neigh[1][1] + neigh[1][2];
		var vy = neigh[0][1] - 2*neigh[1][1] + neigh[2][1];
		v = (vx + vy)*Math.pow(6*dt, 2) - grid_last.get(x, y) + 2*v;
		grid_next.set(x, y, Math.max(-1, Math.min(v, 1)));
	});


	grid_last = grid_curr;
	grid_curr = grid_next;
	grid_next = grid_last;
};

love.keypressed = function(key) {
	if (key == 'R') love.load();
	if (key == 'G') drawGrid = !drawGrid;
	var n = parseInt(key);
	if (n >= 0 && n <= waveSetups.length) curSetup = n;
};

love.draw = function() {

	// Cells
	grid_curr.each(function(x, y, v) {
		love.graphics.setStringColor(palette[round(255 + 255*v)]);
		love.graphics.rectangle('fill', x*S, y*S, S, S);
	});

	// Grid
	if (drawGrid) {
		love.graphics.setColor(255, 255, 255);
		love.graphics.setAlpha(50);
		for (var x=0; x < W*S; x+=S) love.graphics.line(x, 0, x,   H*S);
		for (var y=0; y < H*S; y+=S) love.graphics.line(0, y, W*S, y  );
		love.graphics.setAlpha(255);
	}

	// Mouse cursor
	var mx = Math.floor(love.mouse.getX()/S);
	var my = Math.floor(love.mouse.getY()/S);
	love.graphics.setColor(love.mouse.isDown('left') ? 255 : 127, 255, 127);
	love.graphics.setLineWidth(10);
	love.graphics.rectangle('line', mx*S, my*S, mw*S, mh*S);
};
