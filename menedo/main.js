
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
	.each(function(_, i) {
		var self = d3.select(this);
		self.append("path").attr("class", "line")
		self.append("g").attr("class", "points");
		var focus = self.append("g").attr("class", "focus").style("display", "none");
		focus.append("circle").attr("r", 4.5);
		self.append("text")
			.attr("x", width)
			.attr("y", 10+20*i)
			.attr("text-anchor", "end")
			.text(0);
	});

// Insertamos los accesores en los datos
dataSets.each(function(set) {
	set.x = function(d) { return x(d[0]);         	}
	set.y = function(d) { return y(d[1].e(set.n));	}
});

// Actualizacion de los graficos
function redraw() {
	dataSets.each(function(set) {

		var self = d3.select(this);

		var path = d3.svg.line()
			.interpolate(interpolacion)
			.x(set.x)
			.y(set.y);

		self.select(".line")
			.datum(data).attr("d", path);

		var points = self.select(".points").selectAll("circle").data(data);

		points.enter().append("circle").attr("r", "1.5");
		points.exit().remove();

		points
			.attr("cx", set.x)
			.attr("cy", set.y);
	});
}

var bisect = d3.bisector(function(d) { return d[0]; }).right;
var numberFormat = d3.format("07.3f");
svg.append("rect")
	.attr("class", "overlay")
	.attr("width", width)
	.attr("height", height)
	.on("mouseover", function() { dataSets.select(".focus").style("display", null); })
	.on("mouseout", function() { dataSets.select(".focus").style("display", "none"); })
	.on("mousemove", function mousemove() {
		var x0 = x.invert(d3.mouse(this)[0]),
			i = bisect(data, x0, 1),
			d0 = data[i - 1]
			d1 = data[i],
			d = x0 - d0[0] > d1[0] - x0 ? d1 : d0;

		dataSets.each(function(set) {
			var self = d3.select(this);
			self.select(".focus")
				.attr("transform", "translate(" + set.x(d) + "," + set.y(d) + ")");
			self.select("text")
				.text(set.name.charAt(0).toUpperCase() + " " + numberFormat(d[1].e(set.n)));
		});
	});

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

	// Si es un checkbox, tenemos que hacer un apaño (viva HTML)
	if (self.attr("type") == "checkbox") v = self.is(':checked');

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
	update_value("N",              	3       	);
	update_value("y0_S",           	500     	);
	update_value("y0_Z",           	2       	);
	update_value("y0_R",           	0       	);
	update_value("exterminios",    	0.0050  	);
	update_value("zombificaciones",	0.0095  	);
	update_value("reanimaciones",  	0.0001  	);
	update_value("patrullasP",     	false   	);
	update_value("interpolacion",  	"linear"	);

	recalcular();
	redraw();
}


$("input, select").on("input", input_handler);
$("input[type='checkbox']").on("change keyup", input_handler);
$("button#reset").on("click", reset_values);


reset_values();
