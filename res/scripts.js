var ball;
var stage;
var layer;
var jumpHeight = 200;
var currJumpHeight;
var up = false;
var down = false;
var left = false;
var right = false;
var spacePressed = false;
var speed = 10;
var paddleSpeed = 25;
var newRect;
var paddle;
var ball;
var bgimg;
var bglayer;
var actlayer;
var powerlayer;
var level;
var originalHisto;
var modHisto;
var imgdata;
var isSpawned = false;
var launch = false;
var powerupList = [];
var bullet;
var lives = 5;

var shot = false;

var gun = false;
var floor = false;
var fireball = false;


/*
 *TODO:
 *powerups
 *title screen
 *uploading?
 *access control?
 */


window.onload = function() {
	actlayer = new Kinetic.Layer({});
	bglayer = new Kinetic.Layer({});
	layer = new Kinetic.Layer({});
	powerlayer = new Kinetic.Layer({});
        stage = new Kinetic.Stage({
                container: 'gameWrapper',
                width: 960,
                height: 750
        });
	stage.add(bglayer);
	stage.add(layer);
	stage.add(actlayer);
	stage.add(powerlayer);
	ball = new Kinetic.Circle({
		x: stage.getWidth() / 2,
		y: stage.getHeight() / 2,
		radius:10,
		fill: 'red',
		stroke: 'black',
		strokeWidth:4
	});
	ball.dx = 0;
	ball.dy = 0;
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
	setUpImage();
	updateStatus();
	
	stage.draw();
}

function redraw() {
	powerups();
	var isHittingPaddle = hitTesting();
	moveBall(isHittingPaddle);
	movePowerups();
	pickupPowerup();
	move();
	moveBullet();
	actlayer.draw();
	powerlayer.draw();
}

function powerups() {
	if (Math.floor(Math.random()*200) == Math.floor(Math.random()*100)) {
		var type = Math.floor(Math.random()*3);
		var fill;
		var stroke;
		switch(type) {
			case 0: //fireball
				fill = 'red';
				stroke = 'orange';
				break;
			case 1: //life
				fill = 'red';
				stroke = 'FFBAEF';
				break;
			case 2: //gun
				fill = '00FF22';
				stroke = 'b7faf0';
				break;
		}
		newPowerup = new Kinetic.Circle({
			x:(Math.floor(Math.random()*(stage.getWidth()))),
			y:(Math.floor(Math.random()*(stage.getHeight()-stage.getHeight()/4))),
			fill: fill,
			radius: 15,
			stroke: stroke,
			strokeWidth:4,
		});
		newPowerup.type = type;
		newPowerup.dx = Math.floor(Math.random()*11) - 5;
		powerlayer.add(newPowerup);
		powerupList.push(newPowerup);
	}
}

function movePowerups() {
	for (i in powerupList) {
		powerupList[i].setY(powerupList[i].getY()+4);
		powerupList[i].dx = powerupList[i].dx + (Math.floor(Math.random()*3)) - 1;
		if (powerupList[i].dx > 5) {
			powerupList[i].dx = 5;
		} else if (powerupList[i].dx < -5) {
			powerupList[i].dx = -5;
		}
		if (powerupList[i].getX() <= 0 || powerupList[i].getX()+powerupList[i].getWidth() >= stage.getWidth()) powerupList[i].dx *= -1;
		powerupList[i].setX(powerupList[i].getX() + powerupList[i].dx);
	}
}

function pickupPowerup() {
	for (i in powerupList) {
		if (actlayer.getIntersections(powerupList[i].getX()+powerupList[i].getWidth()/2,powerupList[i].getY()+powerupList[i].getHeight()/2).length > 0) {
			switch(powerupList[i].type) {
				case 0:
					fireball = true;
					fireball.timeout = window.setTimeout(function() {
						fireball = false;
					}, 7000);
					break;
				case 1:
					lives++;
					updateStatus();
					break;
				case 2:
					gun = true;
					gun.timeout = window.setTimeout(function() {
						gun = false;
					}, 7000);
					break;
			}
			powerupList[i].remove();
			powerupList[i].setY(5000);
		}
	}
}

function moveBullet() {
	if (shot) {
		bullet.setY(bullet.getY() - 20);
		var x = bullet.getX();
		var y = bullet.getY();
		var xi = x%30;
		x -= xi;
		xi  = x/30;
		var yi = y%20;
		y -= yi;
		yi = y/20;
		
		if (xi < level.length) {
			if (yi < level[xi].length) {
				if (!level[xi][yi].deleted) {
					updateImage(level[xi][yi].xindex*8, level[xi][yi].value);
					level[xi][yi].remove();
					level[xi][yi].deleted = true;
					shot = false;
					bullet.remove();
					layer.draw();
				}
			}
		}
		if (bullet.getY() < -30) {
			shot = false;
			bullet.remove();
		}
	}
	
}

function moveBall(rebound) {
	if (ball.getY() <= 0) ball.dx, ball.dy *= -1;
	if (ball.getY() > stage.getHeight() + 100){
		lives--;
		updateStatus();
		isSpawned = false;//death
	}
	if (ball.getX() <= 0 || ball.getX() >= stage.getWidth()) ball.dx *= -1;
	if (rebound) {
		ball.dy *= -1;
		var ballTrueX = ball.getX() + ball.getWidth()/2;
		var paddleTrueX = paddle.getX() + paddle.getWidth()/2;
		if (ballTrueX < paddleTrueX - paddle.getWidth()/4)
			ball.dx -= 20;
		else if (ballTrueX < paddleTrueX - paddle.getWidth()/8) {
			ball.dx -= 10;
		} else if (ballTrueX > paddleTrueX + paddle.getWidth()/4) {
			ball.dx += 20;
		} else if (ballTrueX > paddleTrueX + paddle.getWidth()/8) {
			ball.dx += 10;
		}
		if (ball.dx < -30) {
			ball.dx = -30;
		} if (ball.dx > 30) {
			ball.dx = 30;
		}
	}
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
	if (gun) {
		if (spacePressed) {
			if (!shot) {
				bullet = new Kinetic.Rect({
					width: 5,
					height: 20,
					fill: '00FF22',
					stroke: 'b7faf0',
					strokeWidth: 2,
					x: paddle.getX() + paddle.getWidth()/2,
					y: paddle.getY()
				});
				powerlayer.add(bullet);
				shot = true;
			}
		}
	}
	if (!isSpawned) {
		ball.setX(paddle.getX() + paddle.getWidth()/2 - ball.getWidth()/2);
		ball.setY(stage.getHeight() - 50);
		if (spacePressed) {
			isSpawned  = true;
			ball.dx = speed;
			ball.dy = -speed;
		}
	}
	spacePressed = false;
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
		case 32:
			console.log("space");
			spacePressed = true;
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
		var peak = 0;
		for (var j = 8*i; j < 8*(i+1); j++) {
			if (peak < originalHisto[j]) peak = originalHisto[j];
		}
		var divisor = 1;
		while (peak/divisor > 20) {
			divisor *= 5;
		}
		peak /= divisor;
		for (var j = 0; j < peak; j++) {
			var newRect = new Kinetic.Rect({
				x: iterator,
				y: yiterator,
				height:20,
				width:30,
				fill: 'rgb(' + (256-8*i) + ',' + (256-8*i) + ',' + (256-8*i) + ')',
				stroke: 'red',
				strokeWidth: 5,
			});
			newRect.value = divisor;
			newRect.xindex = i;
			newRect.on('click', function() {
				ball.setX(this.getX());
				ball.setY(this.getY());
			});
			level[i][j] = newRect;
			level[i][j].deleted = false;
			layer.add(newRect);
			yiterator += 20;
		}
		iterator += 30;
	}
	layer.draw();
	window.setInterval(function() {redraw()}, 30);
}
function hitTesting() {
	var x = ball.getX();
	var y = ball.getY();
	var xi = x%30;
	x -= xi;
	xi  = x/30;
	var yi = y%20;
	y -= yi;
	yi = y/20;
	
	if (xi < level.length) {
		if (yi < level[xi].length) {
			if (!level[xi][yi].deleted) {
				updateImage(level[xi][yi].xindex*8, level[xi][yi].value);
				level[xi][yi].remove();
				level[xi][yi].deleted = true;
				layer.draw();
				if (!fireball) ball.dy *= -1;
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

function updateImage(fill, value) {
	updateHisto(fill, value);
	var P1 = [256];
	var P2 = [256];
	P1 = CDF(P1, originalHisto);
	P2 = CDF(P2, modHisto);
	var ctx = bglayer.getContext();	
		
	// Get the width/height of the image and set
	// the canvas to the same size.
	var width = stage.getWidth();
	var height = stage.getHeight();
	
	var T = [];

	for (var a = 0; a <= 256-1; a++) {
		var j = 256-1;
		do {
			T[a] = j;
			j --;
		}
		while ((j >= 0) && (P2[a] <= P1[j]));
	}

	var imageData = imgdata;
	var pixelData = imageData.data;
	
	for (var x=0;x < width; x++) {
		for (var y = 0;y < height; y++) {
			
			var startIdx = (y * 4 * width) + (x * 4);
			
			var grayVal = pixelData[startIdx];
			//console.log('a ' + grayVal);
			grayVal = T[grayVal];
			//console.log('b ' + grayVal);
			if (grayVal > 255)
				grayVal = 255;
			if (grayVal < 0)
				grayVal = 0;
			pixelData[startIdx] = grayVal;  //This sets the target pixel with the modified grayVal
			pixelData[startIdx + 1] = grayVal;
			pixelData[startIdx + 2] = grayVal;
		}
	}
	
	ctx.putImageData(imageData,0,0);
}

function updateHisto(fill, value) {
	for (i = fill; i < fill+8; i++) {
		modHisto[i] -= value;
		if (modHisto[i] < 0) modHisto[i] = 0;
	}
}

function CDF(P, histo) {
	var k = 256;
	
	for (var i = 0; i < k; i++) {
		P[i] = 0;
	}
	
	var n = 0;
	var c = 0;
	
	for(var i = 0; i < k; i++) {
		n += Math.round(histo[i]);
	}
	for(var i = 0;i < k;i++) {
		c += histo[i];
		P[i] = c/n;
	}
	return P;
}

function setUpImage() {
	// Create an image object.      
	var image = new Image();
	originalHisto = [];
	modHisto = [];
	
	// Can't do anything until the image loads.
	// Hook its onload event before setting the src property.
	image.onload = function() {
		
		//var imagePlacer = new Kinetic.Image({
		//	image: image,
		//	x: 0,
		//	y: 0,
		//	height: stage.getHeight(),
		//	width: stage.getWidth()
		//});
		//
		//bglayer.add(imagePlacer);
		
		// Create a canvas.
		
		// Get the drawing context.
		
		for (var i = 0; i < 256; i++) {
			originalHisto[i] = 0;
			modHisto[i] = 0;
		}
		
		var ctx = bglayer.getContext();
		
		
		// Get the width/height of the image and set
		// the canvas to the same size.
		var width = stage.getWidth();
		var height = stage.getHeight();
		
		ctx.drawImage(image,0,0,width,height);
		
		
		// Draw the image to the canvas.
		//ctx.drawImage(image, 0, 0);
		
		// Get the image data from the canvas, which now
		// contains the contents of the image.
		var imageData = ctx.getImageData(0, 0, width, height);
		 imgdata = imageData;
		
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
				if (grayScale < 0) grayScale = 0;
				if (grayScale > 255) grayScale = 255;
				//var modulus = grayScale%8;
				//grayScale -= modulus;
				originalHisto[grayScale]++;
				modHisto[grayScale]++;
				
				// Set each RGB value to the same grayscale value.
				pixelData[startIdx] = grayScale;
				pixelData[startIdx + 1] = grayScale;
				pixelData[startIdx + 2] = grayScale;
			}
		}
		
		
		ctx.putImageData(imageData,0,0);
		setupLevel();
		
		// Draw the converted image data back to the canvas.
		//console.log(ctx.getImageData(0,0,width,height).data);
		//bglayer.getContext().putImageData(imageData, 0, 0);
		//console.log(bglayer.getContext().getImageData(0,0,width,height).data);
		//bglayer.draw();
	};
	
	// Load an image to convert.
	image.src = "Mona_Lisa.jpg";
}

function updateStatus() {
	$('#status').text('Lives: ' + lives);
}