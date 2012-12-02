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
var bgimg;
var bglayer;
var actlayer;
var level;


window.onload = function() {
	actlayer = new Kinetic.Layer({});
	bglayer = new Kinetic.Layer({});
	layer = new Kinetic.Layer({});
        stage = new Kinetic.Stage({
                container: 'gameWrapper',
                width: 960,
                height: 750
        });
	stage.add(bglayer);
	stage.add(layer);
	stage.add(actlayer);
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
	actlayer.add(ball);
	actlayer.add(paddle);
	$("body").keydown(function(key) {
		keyDown(key);
	});
	$("body").keyup(function(key) {
		keyUp(key);
	});
	setupLevel();
	window.setInterval(function() {redraw()}, 30);
	imageHandling();
	stage.draw();
}

function redraw() {
	var isHittingPaddle = hitTesting();
	moveBall(isHittingPaddle);
	move();
	//imageHandling();
	actlayer.draw();
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
	level = [];
	for (var i = 0; i < 32; i++) {
		level[i] = [];
		var yiterator = 0;
		for (var j = 0; j < 10; j++) {
			var newRect = new Kinetic.Rect({
				x: iterator,
				y: yiterator,
				height:20,
				width:30,
				fill: 'rgb(' + 8*i + ',' + 8*i + ',' + 8*i + ')',
				stroke: 'red',
				strokeWidth: 5
			});
			level[i][j] = newRect;
			level[i][j].deleted = false;
			layer.add(newRect);
			yiterator += 20;
		}
		iterator += 30;
	}
}
function hitTesting() {
	//var objects = layer.getIntersections(ball.getX(), ball.getY());
	//var isHittingPaddle;
	//for (var i in objects) {
	//	if (objects[i] == ball || objects[i] == bgimg) {
	//	} else if (objects[i] == paddle) {
	//		isHittingPaddle = true;
	//	} else {
	//		objects[i].remove();
	//		ball.dx, ball.dy *= -1;
	//	}
	//}
	//return isHittingPaddle;
	
	var x = ball.getX();
	var y = ball.getY();
	var xi = x%30;
	x -= xi;
	xi  = x/30;
	var yi = y%20;
	y -= yi;
	yi = y/20;
	
	console.log(xi+" "+yi);
	
	if (xi < level.length) {
		if (yi < level[xi].length) {
			if (!level[xi][yi].deleted) {
				level[xi][yi].remove();
				level[xi][yi].deleted = true;
				layer.draw();
				ball.dy *= -1;
			}
		}
	}
	
	objects = actlayer.getIntersections(ball.getX(), ball.getY());
	var paddled;
	if (objects.length > 1)
		paddled = true;
	else
		paddled = false;
	return paddled;
}

function imageHandling() {
	// Create an image object.      
	var image = new Image();
	
	// Can't do anything until the image loads.
	// Hook its onload event before setting the src property.
	image.onload = function() {
		
		// Create a canvas.
		
		// Get the drawing context.
		var ctx = bglayer.getContext();
		
		// Get the width/height of the image and set
		// the canvas to the same size.
		var width = image.width;
		var height = image.height;
		
		stage.width = width;
		stage.height = height;
		
		// Draw the image to the canvas.
		ctx.drawImage(image, 0, 0);
		
		// Get the image data from the canvas, which now
		// contains the contents of the image.
		var imageData = ctx.getImageData(0, 0, width, height);
		
		// The actual RGBA values are stored in the data property.
		var pixelData = imageData.data;
		
		// 4 bytes per pixels - RGBA
		var bytesPerPixel = 4;
		
		// Loop through every pixel - this could be slow for huge images.
		for(var y = 0; y < height; y++) {
			for(var x = 0; x < width; x++) {
				// Get the index of the first byte of the pixel.
				var startIdx = (y * bytesPerPixel * width) + (x * bytesPerPixel);
				
				// Get the RGB values.
				var red = pixelData[startIdx];
				var green = pixelData[startIdx + 1];
				var blue = pixelData[startIdx + 2];
				
				// Convert to grayscale.  An explanation of the ratios
				// can be found here: http://en.wikipedia.org/wiki/Grayscale
				var grayScale = (red * 0.3) + (green * 0.59) + (blue * .11);  
				
				// Set each RGB value to the same grayscale value.
				pixelData[startIdx] = grayScale;
				pixelData[startIdx + 1] = grayScale;
				pixelData[startIdx + 2] = grayScale;
			}
		}
		
		// Draw the converted image data back to the canvas.
		ctx.putImageData(imageData, -200, -200);
	};
	
	// Load an image to convert.
	image.src = "Mona_Lisa.jpg";
}