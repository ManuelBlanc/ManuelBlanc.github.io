// Consts
var W = 80;
var H = 60;
var S = 10;

var SPEED = 1;

var palette = 0;
var paletteArray;

// Conf
var t;
var mw = 5, mh = 5;
var drawGrid = false;

var grid_last, grid_curr, grid_next;
var grid_draw;

var waveSetups = [
	function(x, y, v) { return v; },
	function(x, y, v) {
		if (x === 0) return Math.cos(t);
		return v;
	},
	function(x, y, v) {
		if (x ===   0) return  Math.cos(t);
		if (x === W-1) return -Math.cos(t);
		return v;
	},
	function(x, y, v) {
		if (Math.pow(W/2-x, 2) + Math.pow(H/2-y, 2) < 4) {
			return Math.cos(t);
		}
		return v;
	},
	function(x, y, v) {
		var dd = Math.pow(W/2-x, 2) + Math.pow(H/2-y, 2);
		if (dd >= 20*20 && dd <= 21*21) return Math.cos(t);
		return v;
	},
	function(x, y, v) {
		var dd = Math.pow(W/2-x, 2) + Math.pow(H/2-y, 2);
		var aa = Math.atan2(H/2-y, W/2-x);
		if (dd > 17*17 && dd < 18*18) return Math.cos(aa + t);
		return v;
	},
	function(x, y, v) {
		var mx = 0;
		var my = Math.floor(H/2)-1;
		if (x >= mx && x < mx+3 && y >= my && y < my+3) {
			return 1;
		}
		return v;
	},
	function(x, y, v) {
		var mx = Math.floor(Math.acos(Math.cos((t/30)%1 * 2*Math.PI))/Math.PI*W);
		var my = Math.floor(H/2)-1;
		if (x >= mx && x < mx+3 && y >= my && y < my+3) {
			return 1;
		}
		return v;
	},
	function(x, y, v) {
		var mx = Math.floor(W/2 + 10*Math.cos(2*t));
		var my = Math.floor(H/2 + 10*Math.sin(2*t));
		if (x >= mx && x < mx+3 && y >= my && y < my+3) {
			return 1;
		}
		return v;
	},
	function(x, y, v) {
		var mx = Math.floor(love.mouse.getX()/S);
		var my = Math.floor(love.mouse.getY()/S);
		if (x >= mx && x < mx+mw && y >= my && y < my+mh) {
			return Math.cos(t);
		}
		return v;
	},
];

love.load = function() {
	love.window.setMode(W*S, H*S);
	love.mouse.setVisible(false);

	curSetup = 0;
	t = 0;

	if (paletteArray === undefined) {
		paletteArray = [[], [], [], [], []];
		for (var i=0; i <= 2*255; i++) {
			var v = i - 255;
			var h = Math.floor(i/2);
			/* red/blue     */ paletteArray[0][i] = love.graphics.newColor(Math.max(0, -v), 0, Math.max(0, v));
			/* yellow/green */ paletteArray[1][i] = love.graphics.newColor(Math.max(0, v), Math.abs(v), 0);
			/* black/white  */ paletteArray[2][i] = love.graphics.newColor(h, h, h);
			/* rainbows     */ paletteArray[3][i] = love.graphics.newColorHSL(h, 127, 127);
			/* 2 colors     */ paletteArray[4][i] = (v > 0 ? "white" : "black");
		}
	}

	grid_draw = new Grid(W, H);
	grid_curr = new Grid(W, H);
	grid_last = grid_next = new Grid(W, H);
	// Last and next are aliased
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
	     if (love.mouse.isDown("left" )) setRect(mx, my, mw, mh, +1);
	else if (love.mouse.isDown("right")) setRect(mx, my, mw, mh, -1);

	// Pausing
	if (love.keyboard.isDown(" ")) return;

	t += dt*SPEED;
	//grid_curr.map(waveSetups[curSetup]);

	// Updating cells
	grid_curr.each(function(x, y, v) {
		var neigh = grid_curr.neighbours(x, y);
		var vx = neigh[1][0] - 2*neigh[1][1] + neigh[1][2];
		var vy = neigh[0][1] - 2*neigh[1][1] + neigh[2][1];
		v = (vx + vy)*36*dt*dt - grid_last.get(x, y) + 2*v;
		v = Math.max(-1, Math.min(v, 1));
		grid_next.set(x, y, v);
		grid_draw.set(x, y,  255 + (0|(255*v)));
		// Bitwise OR to truncate the number (round towards 0)
	});

	grid_last = grid_curr;
	grid_curr = grid_next;
	grid_next = grid_last;
};

love.keypressed = function(key) {
	if (key == "R") love.load();
	if (key == "G") drawGrid = !drawGrid;
	if (key == "T") palette = (palette+1) % paletteArray.length;
	var n = parseInt(key);
	if (n >= 0 && n < waveSetups.length) {
		love.load();
		curSetup = n;
	}
};

var sign = function(n) {
	if (n === 0) return 0;
	return (n > 0) ? 1 : -1;
};

love.mousewheel = function(dx, dy, dz) {
	mw = Math.max(2, Math.min(mw+sign(-dx), 20));
	mh = Math.max(2, Math.min(mh+sign(-dx), 20));
};

love.draw = function() {

	// Cells
	grid_draw.each(function(x, y, v) {
		if (v === 255) return;
		love.graphics.setStringColor(paletteArray[palette][v]);
		love.graphics.rectangle("fill", x*S, y*S, S, S);
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
	love.graphics.setColor(love.mouse.isDown("left") ? 255 : 127, 255, 127);
	love.graphics.setLineWidth(10);
	love.graphics.rectangle("line", mx*S, my*S, mw*S, mh*S);

	love.graphics.setStringColor("white");
	love.graphics.setBlendMode("difference");
	love.graphics.print(Math.floor(love.timer.getFPS()) + ' FPS', 800-50, 15);
	love.graphics.setBlendMode("normal");
};
