var newCirc;
var stage;

window.onload = function() {
	layer = new Kinetic.Layer({
		fill: 'blue'
	});
        stage = new Kinetic.Stage({
                container: 'gameWrapper',
                width: 1000,
                height: 1000
        });
	stage.add(layer);
	newCirc = new Kinetic.Circle({
		x: stage.getWidth() / 2,
		y: stage.getHeight() / 2,
		radius: 70,
		fill: 'red',
		stroke: 'black',
		strokeWidth: 4
	});
	layer.add(newCirc);
	stage.draw();
	window.setInterval(function() {moveCirc()}, 33.3);
}

function moveCirc() {
	console.log('hi');
	newCirc.setX(newCirc.getX() + 10);
	stage.draw();
}