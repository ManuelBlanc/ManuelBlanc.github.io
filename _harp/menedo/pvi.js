var y0_S = 500;
var y0_Z = 2;
var y0_R = 0;

var N = 2; // Numero de pasos por dia

var exterminios     = 0.0050; // Alpha
var zombificaciones = 0.0095; // Beta
var reanimaciones   = 0.0001; // Zeta
var patrullasP      = false;  // Patrullas al anochecer?

function f(t, SZR) {

	// Separamos el vector en tres variables
	var S = SZR.e(1), Z = SZR.e(2), R = SZR.e(3);

	return $V([
		- zombificaciones*S*Z	                 	                 	,
		+ zombificaciones*S*Z	+ reanimaciones*R	- exterminios*S*Z	,
		                     	- reanimaciones*R	+ exterminios*S*Z	//
	]);
}

var matrizPatrullas = $M([
	[ 1	, 0  	, 0 ],
	[ 0	, 0.5	, 0 ],
	[ 0	, 0.5	, 1 ]
]);


function metodo_euler(f, x0, y0, x1, NN) {

	var h = (x1 - x0)/NN;
	var x = x0, y = y0;

	var ret = [];
	ret.push([x, y]);

	for (var n=0; n < NN; n++) {
		// Ojo, el orden importa
		y = y.add(f(x, y).x(h));
		x += h;

		if (n%N == 0 && patrullasP) {
			y = matrizPatrullas.x(y);
		}

		ret.push([x, y]);
	}

	return ret;
}

/*
function adams_moulton2(f, x0, y0, x1, N) {

    // Constantes que controlan el metodo
    var TOLERANCIA      = 10e-4;
    var MAX_ITERACIONES = 25;

    // Inicializamos las variables que usaremos
    var h = (x1 - x0)/(N-1);
    var x = x0, y = y0;

    var ret = [];
    ret.push([x, y]);

    // Caso patologico: si N = 1, solo nos pedian un valor
    if (N == 1) return;

    // Calculamos el segundo punto con el metodo de Euler
    y = y.add(f(x, y).x(h));
    x += h;

    // Por cada paso
    for (var n=0; n < N-2; n++) {

        // Primera aproximacion con el Metodo de Euler
        y = y.add(f(x, y).x(h));
        x += h;

        // Iteramos el metodo Adams-Moulton_2 para aproximar el siguiente valor
        for (var i=0; i < MAX_ITERACIONES; i++) {

            // Guardamos temporalmente el valor anterior
            var anterior = y;

            // Calculamos el valor nuevo usando la formula
            y = y(:, n-1) + h*(   5/12 * f(x(n  ), y(:, n  ))
                                      + 2/3  * f(x(n-1), y(:, n-1))
                                      - 1/12 * f(x(n-2), y(:, n-2)) );

            // Si la diferencia es menor que la tolerancia, terminamos pronto
            if norm(y(:, n) - anterior) < TOLERANCIA
                break
            }
        }
    }
}

*/

function recalcular() {
	data = metodo_euler(f, 0, $V([ y0_S , y0_Z , y0_R ]), 10, 1+N*10);
}

recalcular();