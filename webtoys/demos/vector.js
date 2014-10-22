
(function() { "use strict";

	window.Vector = function() {
		this.initialize.apply(this, arguments);
	};

	Vector.prototype.initialize = function(x, y) {
		this.x = x;
		this.y = y;
	};

	Vector.prototype.add = function(that) {
		return new Vector(this.x + that.x, this.y + that.y);
	};

	Vector.prototype.sub = function(that) {
		return new Vector(this.x - that.x, this.y - that.y);
	};

	Vector.prototype.mul = function(that) {
		return new Vector(this.x * that.x, this.y * that.y);
	};

	Vector.prototype.div = function(that) {
		return new Vector(this.x / that.x, this.y / that.y);
	};

	Vector.prototype.dot = function(that) {
		return this.x*that.x + this.y*that.y;
	};


})();