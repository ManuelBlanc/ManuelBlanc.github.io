var pts;
var DIR_X, DIR_Y, INTV, SEGMENTS;
var MAX_PTS = 20;

var palette;

love.load = function() {
	//canvas = love.graphics.newCanvas();
	DIR_X = 0;
	DIR_Y = 0;
	INTV = 200;
	SEGMENTS = 20;

	pts = [];

	if (palette === undefined) {
		palette = [];
		for (var i=0; i < MAX_PTS; i++) {
			palette[i] = love.graphics.newColorHSL(i/MAX_PTS * 255, 127, 127);
		}
	}

	love.mouse.setVisible(false);
	love.graphics.setTextAlign("center");
};

love.keypressed = function(key) {
	if (key == "r") love.load();
};

love.mousepressed = function(mx, my, b) {
	if (b != "left") return;
	pts.push(new Vector(mx, my));
	if (pts.length >= MAX_PTS + 1) pts.shift();
};

var spline = function(x0, y0, x1, y1, m) {
	var mr = (y1 - y0) / (x1 - x0);
	var m0 = m; // or mr
	var q0 = (m0 - mr) / (x0 - x1);
	var m1 = mr + q0*(x1 - x0);
	return {
		m: m1,
		A: q0,
		B: mr - x1*q0 - x0*q0,
		C: y0 - x0*mr + x0*q0*x1,
	};

    // (x - x0)*(mr + (x - x1)*q0) + y0, m1
};

var TX, TY;
var draw_spline = function() {
	//canvas:clear()
	//love.graphics.setCanvas(canvas)

	TX = [];
	TY = [];

	var i;

	if (pts.length >= 2 && INTV > 0) {

		var last = pts[0];
		var dir = new Vector(DIR_X, DIR_Y); // spline(0, lx, INTV, pts[1][2], DIR_X), spline(0, lx, INTV, pts[1][2], DIR_Y) --
		for (i = 1; i < pts.length; i++) {
			var curr = pts[i];

			var quad_x = spline(0, last.x, INTV, curr.x, dir.x);
			var quad_y = spline(0, last.y, INTV, curr.y, dir.y);
			// mx, Ax, Bx, Cx =

			var seg = [];
			love.graphics.setStringColor(palette[(i-1) % palette.length]);
			for (var t = 0; t <= INTV*(1 + 0.5/SEGMENTS); t += INTV/SEGMENTS) {
				var new_pt = new Vector(
					t*(t*quad_x.A + quad_x.B) + quad_x.C,
					t*(t*quad_y.A + quad_y.B) + quad_y.C
				);
				seg.push(new_pt.x); seg.push(new_pt.y);
				love.graphics.circle("line", new_pt.x, new_pt.y, 10);
			}
			love.graphics.line(seg);
			last = curr;
			dir.x = quad_x.m;
			dir.y = quad_y.m;
		}
	}

	for (i = 0; i < pts.length; i++) {
		var v = pts[i];
		love.graphics.setColor(20, 20, 20);
		love.graphics.circle("fill", v.x, v.y, 10);
		love.graphics.setColor(200, 200, 200);
		love.graphics.circle("line", v.x, v.y, 10);
		love.graphics.print(i+1, v.x, v.y-7);
	}
};

love.draw = function() {
	love.graphics.setAlpha(255);
	draw_spline();
	//love.graphics.print(("DIR_X = %4.1f\nDIR_Y = %4.1f\nINTV = %4.1f"):format(DIR_X, DIR_Y, INTV), 10, 10)
	var mx = love.mouse.getX(), my = love.mouse.getY();
	love.graphics.setStringColor("white");
	love.graphics.setAlpha(127);
	love.graphics.rectangle("fill", mx-5, my-5, 10, 10);
	if (pts.length > 0) {
		love.graphics.line(mx, my, pts[0].x, pts[0].y);
	}
};

love.mousewheel = function(dx, dy, dz) {
	INTV = Math.max(1E-3, Math.min(INTV - dy, 1E3));
};

love.update = function(dt) {
	if (pts.length === 0) return;
	DIR_X = 0.01 * (love.mouse.getX() - pts[0].x);
	DIR_Y = 0.01 * (love.mouse.getY() - pts[0].y);
	if (love.keyboard.isDown("right")) INTV =         (INTV + 500*dt);
	if (love.keyboard.isDown("left" )) INTV = Math.max(INTV - 500*dt, 0.0001);
};
