var height = 20;
var width = 30;
var cellSize = 32;
var stage;
var layer;

window.onload = function() {
	
	stage = new Kinetic.Stage({
		container: "canvas",
		width: window.innerWidth-300,
		height: window.innerHeight-50
	});
	stage.setDraggable(true);
	
	layer = new Kinetic.Layer();
	
	var imageObj = new Image();
	imageObj.onload = function() {
		var mainCircle = new Kinetic.Image({
			x: 500,
			y: 500,
			image: imageObj
		});
		mainCircle.setDraggable("draggable");
		mainCircle.on('mouseover', function() {
			stage.setDraggable(false);
		});
		mainCircle.on('mouseout', function() {
			stage.setDraggable(true);
		});
		mainCircle.on('dragend', function() {
			mainCircle.setX(Math.floor(mainCircle.getX() - mainCircle.getX()%cellSize));
			mainCircle.setY(Math.floor(mainCircle.getY() - mainCircle.getY()%cellSize));
			stage.draw();
		});
		layer.add(mainCircle);
		stage.draw();
	}
	imageObj.src = 'res/img/block.png';
	
	createGrid();
	
	function createGrid() {
		for (var i = 0; i <= width; i++) {
			var newLine = new Kinetic.Line({
				points: [i*cellSize, 0, i*cellSize, height*cellSize],
				stroke: 'black',
				strokeWidth: 2
			});
			layer.add(newLine);
		}
		for (var i = 0; i <= height; i++) {
			var newLine = new Kinetic.Line({
				points: [0, i*cellSize, width*cellSize, i*cellSize],
				stroke: 'black',
				strokeWidth: 2
			});
			layer.add(newLine);
		}
	}
	
	var zoom = function(e) {
		var zoomAmount = e.wheelDeltaY*0.001;
		if (layer.getScale().x+zoomAmount > 0)
		layer.setScale(layer.getScale().x+zoomAmount)
		layer.draw();
	}
	
	document.addEventListener("mousewheel", zoom, false);
	
	stage.add(layer);
	stage.draw();
}

function loadImage() {
	
}

