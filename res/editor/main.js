var stage;
var layer;
var selected = '';

var levels = [];
levels.blockURLs = [];
var images = [];
levels.currLevel;
var blockNum;
var player = new Image();
player.src = 'res/img/player.png';

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
		//console.log(y, levels[levels.currLevel].blocks.length);
		//console.log(x, levels[levels.currLevel].blocks[y].length);
		if (y >= 0 && y < levels[levels.currLevel].blocks.length && x >= 0 && x < levels[levels.currLevel].blocks[y].length)
		if (!isNaN(parseInt(selected))) {
			levels[levels.currLevel].blocks[y][x] = parseInt(selected);
		}
		else if (selected == '') {}
		else {
			levels[levels.currLevel].blocks[y][x] = selected;
		}
		drawLevel();
	});
	stage.add(layer);
	stage.draw();
	var path = 'res/img/cursor.png';
	$('#sidebar').append('<div id="listElement"><img height="50" src="'+path+'" onclick="select(\'\')"></img><div class="descriptor">Cursor<br />0x0</div></div>');
	path = 'res/img/null.png';
	$('#sidebar').append('<div id="listElement"><img height="50" src="'+path+'" onclick="select(\'X\')"></img><div class="descriptor">Delete<br />0x0</div></div>');
	path = 'res/img/player.png';
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
			if (levels[levels.currLevel].blocks[i][j] == 'P') {
				var newImage = new Kinetic.Image({
					y: i*levels[levels.currLevel].cellSize,
					x: j*levels[levels.currLevel].cellSize,
					image: player,
					height:levels[levels.currLevel].cellSize*2,
					width:levels[levels.currLevel].cellSize
				});
				layer.add(newImage);
			} else if (typeof(levels[levels.currLevel].blocks[i][j]) == 'number') {
				var newImage = new Kinetic.Image({
					y: i*levels[levels.currLevel].cellSize,
					x: j*levels[levels.currLevel].cellSize,
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
	if (selected == '')
		stage.setDraggable(true);
	else
		stage.setDraggable(false);
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
	
	for (var i = 0; i < this.height; i++) {
		this.blocks[i] = [];
		for (var j = 0; j < this.width; j++) {
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

function exportLevels() {
	var exported = JSON.stringify(levels);
	$('#exportedLevelOutput').modal({overlayClose:true});
	$('#exportArea').text(exported);
}

function importLevels() {
	$('#importedLevelInput').modal({overlayClose:true});
}

function importFinish() {
	console.log('dafux');
	var imported = $('#importArea').val();
	levels = JSON.parse(imported);
	levels.currLevel = 0;
	$.modal.close();
	$('#levelSelect').html('<option value="new">New level</option>');
	for (var i = 0; i < levels.length; i++)
		$('#levelSelect').append('<option value="' + (i) + '">Level ' + (i+1) + '</option>');
	drawLevel();
}