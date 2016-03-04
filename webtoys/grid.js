(function() { "use strict";

	var Grid = window.Grid = function() {
		this.initialize.apply(this, arguments);
	};

	Grid.prototype.initialize = function(w, h) {
		var y, x;
		this.w = w;
		this.h = h;
		this.cells = [];
		for (y = 0; y < this.h; y++) {
			this.cells[y] = [];
			for (x = 0; x < this.w; x++) {
				this.cells[y][x] = 0;
			}
		}
	};

	Grid.prototype.set = function(x, y, v) {
		if (x < 0 || x >= this.w) return;
		if (y < 0 || y >= this.h) return;
		this.cells[y][x] = v;
	};

	Grid.prototype.get = function(x, y) {
		if (x < 0 || x >= this.w) return 0;
		if (y < 0 || y >= this.h) return 0;
		if (this.cells[y][x] === false) return false;
		return this.cells[y][x];
	};

	Grid.prototype.each = function(chunk) {
		for (var y = 0; y < this.h; y++) {
			for (var x = 0; x < this.w; x++) {
				chunk(x, y, this.cells[y][x]);
			}
		}
	};

	Grid.prototype.map = function(chunk) {
		for (var y = 0; y < this.h; y++) {
			for (var x = 0; x < this.w; x++) {
				this.cells[y][x] = chunk(x, y, this.cells[y][x]);
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

	Grid.prototype.neighboursReduce = function(x, y, chunk, init) {
		for (var i=-1; i <= 1; i++) {
			for (var j=-1; j <= 1; j++) {
				init = chunk(this.get(x+i, y+j), init);
			}
		}
	};

})();