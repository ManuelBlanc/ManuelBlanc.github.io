// Consts
var W = 80;
var H = 60;
var S = 10;

var palette = [];

var grid_last, grid_curr, grid_next;

love.load = function() {
	love.window.setMode(W*S, H*S);

	for (var i=0; i <= 2*255; i++) {
		var v = i - 255;
		palette[i] = love.graphics.newColor(Math.max(0, v), Math.abs(v), 0);
	}

	grid_curr = new Grid(W, H);
	grid_last = grid_next = new Grid(W, H);
	// Last and next are aliased
};

var round = function(n) {
	return n > 0 ? Math.floor(n) : Math.ceil(n);
};

love.update = function(dt) {
	var x, y;
	// Mouse editing
	var mx = Math.floor(love.mouse.getX()/S);
	var my = Math.floor(love.mouse.getY()/S);
	     if (love.mouse.isDown('left' )) grid_last.set(mx, my,  1);
	else if (love.mouse.isDown('right')) grid_last.set(mx, my, -1);

	// Pausing
	if (love.keyboard.isDown(' ')) return;

	var t = love.timer.getTime();

	// Updating cells
	grid_curr.each(function(x, y, v) {
		var neigh = grid_curr.neighbours(x, y);
		var vx = neigh[1][0] - 2*neigh[1][1] + neigh[1][2];
		var vy = neigh[0][1] - 2*neigh[1][1] + neigh[2][1];
		v = (vx + vy)*Math.pow(6*dt, 2) - grid_last.get(x, y) + 2*v;
		grid_next.set(x, y, Math.max(-1, Math.min(v, 1)));

		if (Math.pow(8-x, 2) + Math.pow(24-y, 2) < 4) {
			grid_last.set(x, y, Math.cos(t));
		}
	});


	grid_last = grid_curr;
	grid_curr = grid_next;
	grid_next = grid_last;
};

love.draw = function() {

	// Cells
	grid_curr.each(function(x, y, v) {
		love.graphics.setStringColor(palette[round(255 + 255*v)]);
		love.graphics.rectangle('fill', x*S, y*S, S, S);
	});

	// Mouse cursor
	var mx = Math.floor(love.mouse.getX()/S),
	    my = Math.floor(love.mouse.getY()/S);
	love.graphics.setColor(love.mouse.isDown('left') ? 255 : 127, 255, 127);
	love.graphics.setLineWidth(10);
	love.graphics.rectangle('line', mx*S, my*S, S, S);
};
