// CSS 3D Transforms    	-- http://desandro.github.io/3dtransforms/
// Icosahedron          	-- https://matthewlein.com/experiments/20sided.html
// Rotation Manipulation	-- http://w3.eleqtriq.com/2010/11/natural-object-rotation-with-css3-3d/


$(function() {
	"use strict";

	var ang = {x: 0, y: 0, z: 0};
	var dragging = false, lx, ly;
	var dang = {x: 0, y: 0, z: 0};

	function cosdeg(a) { return Math.cos(a/180*Math.PI).toFixed(2); }
	function sindeg(a) { return Math.sin(a/180*Math.PI).toFixed(2); }

	var transform = _.template("rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)")
	var debug = _.template("${n}: ${a} (cos:${c}, sin:${s})");
	function updateDice(dontSetSliders) {

		ang.x = (ang.x + 360) % 360;
		ang.y = (ang.y + 360) % 360;
		ang.z = (ang.z + 360) % 360;

		$(".circles .x").css("transform", transform({ x: 0,       	y: 90,   	z: 0 }));
		$(".circles .y").css("transform", transform({ x: 90+ang.x,	y: 0,    	z: 0 }));
		$(".circles .z").css("transform", transform({ x: ang.x,   	y: ang.y,	z: 0 }));
		$(".dice6").css("transform", transform(ang));

		if (dontSetSliders) return;
		$(".sliders input[type=range]").each(function() {
			var $this = $(this);
			$this.val(ang[$this.data("value")]);
		});
	}

	$(".sliders input[type=range]").on("input change", function() {
		var $this = $(this);
		ang[$this.data("value")] = parseInt($this.val(), 10);
		updateDice(true);
	});

	// Begin drag
	$(".dice6").on("mousedown", function(evt) {
		lx = evt.screenX;
		ly = evt.screenY;
		dragging = true;
		dang.x = ang.x;
		dang.y = ang.y;
		dang.z = ang.z;
	});

	// End drag
	$(document).on("mouseup", function(evt) {
		dragging = false;
	});

	// Drag tick
	$(document).on("mousemove", function(evt) {
		if (!dragging) return;
		var dx = (evt.screenX - lx) / 2;
		var dy = (evt.screenY - ly) / 2;
		lx = evt.screenX;
		ly = evt.screenY;

		ang.x += -dy;
		ang.y += +dx;//*Math.cos(ang.x/180*Math.PI);
		ang.z += 0//-dx*Math.sin(ang.x/180*Math.PI);

		updateDice();
	});

	// $(document).on("keydown", function(evt) {
	//	if (evt.keyCode === 32) {
	//		evt.preventDefault();
	//	}
	// });

	updateDice();


	function printAngles(x, y, z) {

	}
	var phi = (1 + Math.sqrt(5))/2;



});