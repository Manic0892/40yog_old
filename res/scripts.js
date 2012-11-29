var newCirc;
var stage;
var jumpHeight = 200;
var currJumpHeight;
var up = false;
var down = false;
var left = false;
var right = false;
var speed = 10;

window.onload = function() {
	layer = new Kinetic.Layer({
		fill: 'blue'
	});
        stage = new Kinetic.Stage({
                container: 'gameWrapper',
                width: 1000,
                height: 750
        });
	stage.add(layer);
	newCirc = new Kinetic.Rect({
		x: stage.getWidth() / 2,
		y: stage.getHeight() / 2,
		height:20,
		width:20,
		fill: 'red',
		stroke: 'black',
		strokeWidth: 4,
	});
	newRect = new Kinetic.Circle({
		x:100,
		y:100,
		radius:75,
		fill:'blue',
		stroke: 'black',
		strokeWidth:4
	});
	layer.add(newCirc);
	layer.add(newRect);
	stage.draw();
	window.setInterval(function() {redraw()}, 29.3);
	$("body").keydown(function(key) {
		keyDown(key);
	});
	$("body").keyup(function(key) {
		keyUp(key);
	});
}

function redraw() {
	console.log(stage.getIntersections(newCirc.getX(), newCirc.getY()));
	move();
	stage.draw();
}

function move() {
	if (up) {
		newCirc.setY(newCirc.getY()-speed);
	}
	if (left) {
		newCirc.setX(newCirc.getX()-speed);
	}
	if (down) {
		newCirc.setY(newCirc.getY()+speed);
	}
	if (right) {
		newCirc.setX(newCirc.getX()+speed);
	}
}

function keyDown(key) {
	switch (key.keyCode) {
		case 37:
			console.log("left");
			left = true;
			break;
		case 38:
			console.log("up");
			up = true;
			break;
		case 39:
			console.log("right");
			right = true;
			break;
		case 40:
			console.log("down");
			down = true;
			break;
	}
}

function keyUp(key) {
	switch (key.keyCode) {
		case 37:
			console.log("left");
			left = false;
			break;
		case 38:
			console.log("up");
			up = false;
			break;
		case 39:
			console.log("right");
			right = false;
			break;
		case 40:
			console.log("down");
			down = false;
			break;
	}
}