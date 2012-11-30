var ball;
var stage;
var layer;
var jumpHeight = 200;
var currJumpHeight;
var up = false;
var down = false;
var left = false;
var right = false;
var speed = 10;
var paddleSpeed = 25;
var newRect;
var paddle;
var ball;

window.onload = function() {
	layer = new Kinetic.Layer({
		fill: 'blue'
	});
        stage = new Kinetic.Stage({
                container: 'gameWrapper',
                width: 960,
                height: 750
        });
	stage.add(layer);
	ball = new Kinetic.Circle({
		x: stage.getWidth() / 2,
		y: stage.getHeight() / 2,
		radius:10,
		fill: 'red'
	});
	ball.dx = speed;
	ball.dy = speed;
	paddle = new Kinetic.Rect({
		x: stage.getWidth()/2 - 100,
		y: stage.getHeight()-30,
		width: 200,
		height: 20,
		fill: 'red',
		stroke: 'black',
		strokeWidth: 4
	});
	layer.add(ball);
	layer.add(paddle);
	stage.draw();
	window.setInterval(function() {redraw()}, 30);
	$("body").keydown(function(key) {
		keyDown(key);
	});
	$("body").keyup(function(key) {
		keyUp(key);
	});
	setupLevel();
}

function redraw() {
	var objects = stage.getIntersections(ball.getX(), ball.getY());
	var isHittingPaddle;
	for (var i in objects) {
		if (objects[i] == ball) {
		} else if (objects[i] == paddle) {
			isHittingPaddle = true;
		} else {
			objects[i].remove();
			ball.dx, ball.dy *= -1;
		}
	}
	moveBall(isHittingPaddle);
	move();
	stage.draw();
}

function moveBall(rebound) {
	if (rebound) ball.dx, ball.dy *= -1;
	if (ball.getY() <= 0) ball.dx, ball.dy *= -1;
	if (ball.getX() <= 0 || ball.getX() >= stage.getWidth()) ball.dx *= -1;
	ball.setX(ball.getX()+ball.dx);
	ball.setY(ball.getY()+ball.dy);
}

function move() {
	if (left && paddle.getX() - paddle.getStrokeWidth() >= 0) {
		paddle.setX(paddle.getX()-paddleSpeed);
	}
	if (right && paddle.getX() + paddle.getWidth() + paddle.getStrokeWidth() <= stage.getWidth()) {
		paddle.setX(paddle.getX()+paddleSpeed);
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
function setupLevel() {
	var iterator = 0;
	for (var i = 0; i < 32; i++) {
		var newRect = new Kinetic.Rect({
			x: iterator,
			y: 0,
			height:20,
			width:30,
			fill: 'rgb(' + 8*i + ',' + 8*i + ',' + 8*i + ')',
			stroke: 'red',
			strokeWidth: 5
		});
		layer.add(newRect);
		iterator += 30;
	}
}
function handleCollisions() {
	
}