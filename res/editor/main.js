var stage;
var layer;
var selected = '';

var levels = [];
levels.blockURLs = [];
var images = [];
levels.currLevel;
var blockNum;

window.onload = function() {
	stage = new Kinetic.Stage({
		container: "canvas",
		width: window.innerWidth-300,
		height: window.innerHeight-window.innerHeight/25
	});
	stage.setDraggable(true);
	layer = new Kinetic.Layer();
	stage.getContainer().addEventListener('mousedown', function(evt) {
		var x = (stage.getMousePosition().x - stage.getX())/layer.getScale().x;
		var y = (stage.getMousePosition().y - stage.getY())/layer.getScale().y;
		x = Math.floor(x/levels[levels.currLevel].cellSize);
		y = Math.floor(y/levels[levels.currLevel].cellSize);
		levels[levels.currLevel].blocks[x][y] = parseInt(selected);
		drawLevel();
	});
	stage.add(layer);
	stage.draw();
	var path = 'res/img/null.png';
	$('#sidebar').append('<div id="listElement"><img height="50" src="'+path+'" onclick="select(\'X\')"></img><div class="descriptor">Delete<br />0x0</div></div>');
	path = 'res/img/placeholder.png';
	$('#sidebar').append('<div id="listElement"><img height="50" src="'+path+'" onclick="select(\'P\')"></img><div class="descriptor">Player<br />0x0</div></div>');
	var zoom = function(e) {
		if (stage.getMousePosition()) {
			var zoomAmount = e.wheelDeltaY*0.001;
			if (layer.getScale().x+zoomAmount > 0)
				layer.setScale(layer.getScale().x+zoomAmount)
			layer.draw();
		}
	}
	
	document.addEventListener("mousewheel", zoom, false);
}

function addNewBlock() {
	var path = $('#inFile').val();
	path = path.replace("C:\\fakepath\\", "");
	fullPath = ('res/img/') + path;
	var img = new Image();
	img.src = fullPath;
	images.push(img);
	img.onload = function() {
		levels.blockURLs.push(fullPath);
		if (this.width > this.height)
			$('#sidebar').append('<div id="listElement"><img width="50" src="'+fullPath+'" onclick="select(\'' + (levels.blockURLs.length - 1) + '\')"></img><div class="descriptor">' + path + '<br />' + this.width + 'x' + this.height + '</div></div>');
		else if (this.height >= this.width) {
			$('#sidebar').append('<div id="listElement"><img height="50" src="'+fullPath+'" onclick="select(\'' + (levels.blockURLs.length - 1) + '\')"></img><div class="descriptor">' + path + '<br />' + this.width + 'x' + this.height + '</div></div>');
		}
	}
}

function drawLevel() {
	layer.removeChildren();
	for (var i = 0; i <= levels[levels.currLevel].width; i++) {
		var newLine = new Kinetic.Line({
			points: [i*levels[levels.currLevel].cellSize, 0, i*levels[levels.currLevel].cellSize, levels[levels.currLevel].height*levels[levels.currLevel].cellSize],
			stroke: 'black',
			strokeWidth: 2
		});
		layer.add(newLine);
	}
	for (var i = 0; i <= levels[levels.currLevel].height; i++) {
		var newLine = new Kinetic.Line({
			points: [0, i*levels[levels.currLevel].cellSize, levels[levels.currLevel].width*levels[levels.currLevel].cellSize, i*levels[levels.currLevel].cellSize],
			stroke: 'black',
			strokeWidth: 2
		});
		layer.add(newLine);
	}
	for (i in levels[levels.currLevel].blocks) {
		for (j in levels[levels.currLevel].blocks[i]) {
			console.log('here');
			if (typeof(levels[levels.currLevel].blocks[i][j]) != 'string')
				console.log(typeof(levels[levels.currLevel].blocks[i][j]));
			if (typeof(levels[levels.currLevel].blocks[i][j]) == 'number') {
				console.log('here2');
				var newImage = new Kinetic.Image({
					y: j*levels[levels.currLevel].cellSize,
					x: i*levels[levels.currLevel].cellSize,
					image: images[levels[levels.currLevel].blocks[i][j]]
				});
				layer.add(newImage);
			}
		}
	}
	stage.draw();
}

function select(path) {
	selected=path;
	console.log(path);
}

function newLevel() {
	var cellSize = $('#cellSize').val();
	var height = $('#height').val();
	var width = $('#width').val();
	levels.push(new Level({cellSize: cellSize, height: height, width: width}));
	$('#levelSelect').append('<option value="' + (levels.length - 1) + '">Level ' + levels.length + '</option>');
	levels.currLevel = levels.length-1;
	drawLevel();
	$.modal.close();
}

function selectLevel() {
	var selection = $('#levelSelect').val();
	if (selection == 'new') {
		$('#newLevelInput').modal({overlayClose:true});
	} else {
		levels.currLevel = selection;
		drawLevel();
	}
}

function Level(options) {
	this.height = options.height;
	this.width = options.width;
	this.cellSize = options.cellSize;
	this.blocks = [];
	this.events = [];
	
	for (var i = 0; i < options.height; i++) {
		this.blocks[i] = [];
		for (var j = 0; j < options.width; j++) {
			this.blocks[i][j] = 'X';
		}
	}
	
	this.build = function() {
		this.spriteList = new jaws.SpriteList();
		for (i in this.blocks) {
			for (j in this.blocks[i]) {
				if (this.blocks[i][j] != 0)
					this.spriteList.push(new jaws.Sprite({image:this.blockURLs[this.blocks[i][j]-1],x:j*this.cellSize, y:i*this.cellSize}));
			}
		}
	}
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