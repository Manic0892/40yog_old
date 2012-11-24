var newCirc;
var stage;
var jumping = false;
var jumpHeight = 200;
var currJumpHeight;



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
	window.setInterval(function() {redraw()}, 29.3);
	$("body").keydown(function(key) {
		keyDown(key);
	});
	$("body").keyup(function(key) {
		keyUp(key);
	});
}

function redraw() {
	moveCirc();
	stage.draw();
}

function moveCirc() {
	if (jumping == true && currJumpHeight < jumpHeight) {
		if (currJumpHeight < jumpHeight) {
			currJumpHeight += 10;
			newCirc.setY(newCirc.getY() - 10);
		} else {
			if (newCirc.getY() > stage.getHeight()) {
				jumping = false;
			} else {
				newCirc.setY(newCirc.getY() + 10);
			}
		}
	} else {
		if (newCirc.getY() > stage.getHeight()) {
		} else {
			newCirc.setY(newCirc.getY() + 10);
		}
	}
}

function jump() {
	currJumpHeight = 0;
	jumping = true;
}

function keyDown(key) {
	switch (key.keyCode) {
		case 37:
			console.log("left");
			break;
		case 38:
			console.log("up");
			jump();
			break;
		case 39:
			console.log("right");
			break;
		case 40:
			console.log("down");
			break;
	}
}

function keyUp(key) {
	switch (key.keyCode) {
		case 37:
			console.log("left");
			break;
		case 38:
			console.log("up");
			break;
		case 39:
			console.log("right");
			break;
		case 40:
			console.log("down");
			break;
	}
}