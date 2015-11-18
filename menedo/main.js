
var margin = {top: 20, right: 20, bottom: 30, left: 50},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

// Escalas
var x = d3.scale.linear().domain([0, 10]).range([0, width]);
var y = d3.scale.linear().domain([0, 500]).range([height, 0]);

// Ejes
var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");

// Preparacion del grafico
var svg = d3.select("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Añadimos los ejes
svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);
svg.append("g")
	.attr("class", "y axis")
	.call(yAxis);

// Grupos para cada set de datos
var dataSets = svg.selectAll("g.dataSet").data([
	{ n: 1, name: "survivors"	},
	{ n: 2, name: "zombies"  	},
	{ n: 3, name: "dead"     	},
]);

// Añadimos los grupos para cada set
dataSets.enter().append("g")
	.attr("class", function(d) { return "dataSet " + d.name; })
	.each(function(){
		var self = d3.select(this);
		self.append("path").attr("class", "line")
		self.append("g").attr("class", "points");
	});


// Actualizacion de los graficos
function redraw() {
	dataSets.each(function(setData) {

		var self = d3.select(this);
		var n = setData.n;

		var path = d3.svg.line()
			.interpolate(interpolacion)
			.x(function(d) { return x(d[0]);     	})
			.y(function(d) { return y(d[1].e(n));	});

		self.select(".line")
			.datum(data).attr("d", path);

		var points = self.select(".points").selectAll("circle").data(data);

		points.enter().append("circle").attr("r", "1.5");
		points.exit().remove();

		points
			.attr("cx", function(d) { return x(d[0]);     	})
			.attr("cy", function(d) { return y(d[1].e(n));	});
	});
}


// Actualiza un valor global
function update_value(name, value) {
	$("input[name='" + name + "']").val(value);
	window[name] = value;
}

// Handler de input events
function input_handler() {

	var self = $(this);

	// Leemos el valor
	var v = self.val();

	// Acotamos por min y max (si estan definidos)
	if (self.attr("min")) v = Math.max(v, self.attr("min"));
	if (self.attr("max")) v = Math.min(v, self.attr("max"));

	// Lo actualizamos globalmente
	update_value(self.attr("name"), v);

	// Recalculamos
	recalcular();

	// Y regeneramos los graficos
	redraw();

}

function reset_values() {
	update_value("N",              	3     	);
	update_value("exterminios",    	0.0050	);
	update_value("zombificaciones",	0.0095	);
	update_value("reanimaciones",  	0.0001	);
	update_value("patrullasP",     	false 	);
	update_value("interpolacion",  	false 	);
}


$("input, select").on("input", input_handler);
$("input[type='checkbox']").on("change keyup", input_handler);
$("button#reset").on("click", reset_values);


reset_values();
redraw();
