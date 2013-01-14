var stage;
var layer;
var selected = '';

var levels = [];
var blockURLs = [];
var blockNum;

window.onload = function() {
	stage = new Kinetic.Stage({
		container: "canvas",
		width: window.innerWidth-300,
		height: window.innerHeight-window.innerHeight/25
	});
	stage.setDraggable(true);
	layer = new Kinetic.Layer();
	stage.add(layer);
	stage.draw();
	var path = 'res/img/null.png';
	$('#sidebar').append('<div id="listElement"><img height="50" src="'+path+'" onclick="select(\'0\')"></img><div class="descriptor">Delete<br />0x0</div></div>');
	path = 'res/img/placeholder.png';
	$('#sidebar').append('<div id="listElement"><img height="50" src="'+path+'" onclick="select(\'P\')"></img><div class="descriptor">Player<br />0x0</div></div>');
	blockURLs.push(null);
}

function addNewBlock() {
	var path = $('#inFile').val();
	path = path.replace("C:\\fakepath\\", "");
	fullPath = ('res/img/') + path;
	var img = new Image();
	img.src = fullPath;
	img.onload = function() {
		blockURLs.push(fullPath);
		if (this.width > this.height)
			$('#sidebar').append('<div id="listElement"><img width="50" src="'+fullPath+'" onclick="select(\'' + (blockURLs.length - 1) + '\')"></img><div class="descriptor">' + path + '<br />' + this.width + 'x' + this.height + '</div></div>');
		else if (this.height >= this.width) {
			$('#sidebar').append('<div id="listElement"><img height="50" src="'+fullPath+'" onclick="select(\'' + (blockURLs.length - 1) + '\')"></img><div class="descriptor">' + path + '<br />' + this.width + 'x' + this.height + '</div></div>');
		}
	}
}

function select(path) {
	console.log(path);
}


//var height = 20;
//var width = 30;
//var cellSize = 32;
//var stage;
//var layer;
//
//var levels = [];
//var blocks = [];
//
//window.onload = function() {
//	
//	stage = new Kinetic.Stage({
//		container: "canvas",
//		width: window.innerWidth-300,
//		height: window.innerHeight-window.innerHeight/25
//	});
//	stage.setDraggable(true);
//	
//	layer = new Kinetic.Layer();
//	
//	var imageObj = new Image();
//	imageObj.onload = function() {
//		var mainCircle = new Kinetic.Image({
//			x: 128,
//			y: 128,
//			image: imageObj
//		});
//		mainCircle.isBlock = true;
//		mainCircle.setDraggable("draggable");
//		mainCircle.on('mouseover', function() {
//			stage.setDraggable(false);
//		});
//		mainCircle.on('mouseout', function() {
//			stage.setDraggable(true);
//		});
//		mainCircle.on('dragend', function() {
//			mainCircle.setX(Math.floor(mainCircle.getX() - mainCircle.getX()%cellSize));
//			mainCircle.setY(Math.floor(mainCircle.getY() - mainCircle.getY()%cellSize));
//			stage.draw();
//		});
//		layer.add(mainCircle);
//		stage.draw();
//	}
//	imageObj.src = 'res/img/block.png';
//	
//	createGrid();
//	
//	function createGrid() {
//		for (var i = 0; i <= width; i++) {
//			var newLine = new Kinetic.Line({
//				points: [i*cellSize, 0, i*cellSize, height*cellSize],
//				stroke: 'black',
//				strokeWidth: 2
//			});
//			layer.add(newLine);
//		}
//		for (var i = 0; i <= height; i++) {
//			var newLine = new Kinetic.Line({
//				points: [0, i*cellSize, width*cellSize, i*cellSize],
//				stroke: 'black',
//				strokeWidth: 2
//			});
//			layer.add(newLine);
//		}
//	}
//	
//	var zoom = function(e) {
//		if (stage.getMousePosition()) {
//			var zoomAmount = e.wheelDeltaY*0.001;
//			if (layer.getScale().x+zoomAmount > 0)
//				layer.setScale(layer.getScale().x+zoomAmount)
//			layer.draw();
//		}
//	}
//	
//	document.addEventListener("mousewheel", zoom, false);
//	
//	stage.add(layer);
//	stage.draw();
//}
//
//function loadImage() {
//	
//}
//
//function exec() {
//	var path = $('#inFile').val();
//	path = path.replace("C:\\fakepath\\", "");
//	path = ('res/img/') + path;
//	console.log(path);
//	var image2 = new Image();
//	image2.src = path;
//	image2.onload = function() {
//		var newimage = new Kinetic.Image({
//			x:256,
//			y:256,
//			image:image2
//		});
//		newimage.isBlock = true;
//		newimage.setDraggable("draggable");
//		newimage.on('mouseover', function() {
//			stage.setDraggable(false);
//		});
//		newimage.on('mouseout', function() {
//			stage.setDraggable(true);
//		});
//		newimage.on('dragend', function() {
//			this.setX(Math.floor(this.getX() - this.getX()%cellSize));
//			this.setY(Math.floor(this.getY() - this.getY()%cellSize));
//			stage.draw();
//		});
//		layer.add(newimage);
//		stage.draw();
//	}
//	//$('#newLevelInput').modal({overlayClose:true});
//}
//
//function newLevel() {
//	console.log($('#cellSize').val());
//	$.modal.close();
//	
//}