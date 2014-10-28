var W = 80;
var H = 60;
var S = 10;
var TIME_STEP = 0.5;

var t;
var palette = [];
var mhue = 0, mw = 1, mh = 1;
var drawGrid = false;
var tick = 0;
var iterations = 0;

var grid_last, grid_curr, grid_next;

love.load = function() {
	love.window.setMode(W*S, H*S);
	love.mouse.setVisible(false);

	for (var i=0; i <= 255; i++) {
		palette[i] = love.graphics.newColorHSL(i, 255, 127);
	}

	t = 0;

	grid_curr = new Grid(W, H);
	grid_last = grid_next = new Grid(W, H);
	// Last and next are aliased

	grid_last.map(function() { return false; });
	grid_curr.map(function() { return false; });
};

var neighMean = function(neigh) {
	var mx = 0, my = 0;
	for (var i=0; i < neigh.length; i++) {
		if (neigh[i] === false) continue;
		mx += Math.cos(neigh[i]/255*2*Math.PI);
		my += Math.sin(neigh[i]/255*2*Math.PI);
	}
	if (mx === 0 && my === 0) {
		return Math.floor(Math.random()*256);
	}
	return Math.atan2(my, mx)/Math.PI*255;
};

var cnt = function(_, n) { return n+1; };
var life_think = function(x, y) {
	var count = grid_curr.neighboursReduce(x, y, cnt, 0);

	     if (count  < 2) return false;
	else if (count  > 3) return false;
	else if (count == 3) return 1;
};

love.mousepressed = function (x, y, b) {
	x = Math.floor(x/S);
	y = Math.floor(y/S);
	     if (b == "left"     ) grid_curr.set(x, y, mhue);
	else if (b == "right"    ) grid_curr.set(x, y, false);
	else if (b == "middle"   ) mhue = math.floor(Math.random()*256);
};

love.mousewheel = function(dx, dy, dz) {
	mhue = pmod(mhue + dx, 255);
};

love.keypressed = function(key, unicode) {
	     if (key == "escape") life.init();
	else if (key == "g"     ) grid = !grid;
	else if (key == "r"     ) {
		var rx = Math.floor(love.mouse.getX()/S),
		    ry = Math.floor(love.mouse.getY()/S);
		var h = mhue, i = 15;
		grid_curr.set(rx, ry, h);
		while (i > 0) {
			var r = Math.random(9);
			rx = rx + r%3 - 1;
			ry = ry + Math.ceil(r/3) - 2;
			h = (h + (Math.random() < 0.5 ? 5 : -5)) % 255;
			if (grid_curr.get(rx, ry) === false) {
				grid_curr.set(rx, ry, h);
				i = i - 1;
			}
			else {
				i -= 0.1;
			}
		}
	}
	else if (key == "s" && love.keyboard.isDown(" ")) {
		this.update(-1);
	}
};

love.update = function(dt) {
	if (t > 0) { t -= dt; return; } t += TIME_STEP;
	if (love.keyboard.isDown(" ")) return;

	grid_curr.each(function(x, y, v) {
		grid_next.set(x, y, life_think(x, y));
	});

	grid_last = grid_curr;
	grid_curr = grid_next;
	grid_next = grid_last;

	iterations++;
};

love.draw = function() {
	var r = S/2;
	grid_curr.each(function(x, y, v) {
		if (v === false) return;
		love.graphics.setStringColor(palette[v]);
		//love.graphics.rectangle("fill", x*S, y*S, S, S);
		love.graphics.circle("fill", x*S+r, y*S+r, r);
	});

	if (drawGrid) {
		love.graphics.setStringColor("white");
		love.graphics.setAlpha(50);
		for (var x=0; x < W*S; x+=S) love.graphics.line(x, 0, x,   H*S);
		for (var y=0; y < H*S; y+=S) love.graphics.line(0, y, W*S, y  );
		love.graphics.setAlpha(255);
	}

	love.graphics.setStringColor("white");
	love.graphics.print(iterations, 5, 20);
	love.graphics.print(love.timer.getFPS() + " FPS", 5, 45);

	// Mouse cursor
	var mx = Math.floor(love.mouse.getX()/S),
	    my = Math.floor(love.mouse.getY()/S);
	love.graphics.setColor(love.mouse.isDown('left') ? 255 : 127, 255, 127);
	love.graphics.setLineWidth(10);
	love.graphics.rectangle('line', mx*S, my*S, mw*S, mh*S);
};

