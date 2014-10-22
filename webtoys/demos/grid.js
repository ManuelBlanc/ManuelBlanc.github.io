(function() { "use strict";

	window.Grid = function() {
		this.initialize.apply(this, arguments);
	};

	Grid.prototype.initialize = function(w, h) {
		var y, x;
		this.cells = [];
		for (y = 0; y < H; y++) {
			this.cells[y] = [];
			for (x = 0; x < W; x++) {
				this.cells[y][x] = 0;
			}
		}
	};

	Grid.prototype.set = function(x, y, v) {
		if (x < 0 || x >= W) return false;
		if (y < 0 || y >= H) return false;
		this.cells[y][x] = Math.max(-1, Math.min(v, 1));
	};

	Grid.prototype.get = function(x, y) {
		if (x < 0 || x >= W) return 0;
		if (y < 0 || y >= H) return 0;
		if (this.cells[y][x] === false) return 0;
		return this.cells[y][x];
	};

	Grid.prototype.each = function(chunk) {
		for (var y = 0; y < H; y++) {
			for (var x = 0; x < W; x++) {
				chunk(x, y, this.cells[y][x]);
			}
		}
	};

	Grid.prototype.neighbours = function(x, y) {
		return [
			[ this.get(x-1, y-1), this.get(x, y-1), this.get(x+1, y-1) ],
			[ this.get(x-1, y  ), this.get(x, y  ), this.get(x+1, y  ) ],
			[ this.get(x-1, y+1), this.get(x, y+1), this.get(x+1, y+1) ],
		];
	};

})();