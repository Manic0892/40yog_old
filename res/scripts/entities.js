function State(level) {
	this.setup = function() {
		this.level = level;
		this.level.build();
		this.paused = false;
	}
	this.update = function() {
		for (i in this.level.events) {
			if (this.level.events[i].trig()) {
				this.level.events[i].exec();
			}
		}
	}
	this.draw = function() {
		jaws.clear();
		this.level.spriteList.draw();
	}
}

function Level(options) {
	this.defaultOptions = {cellSize: 32, height: 5, width: 5, blocks: [[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1]], blockURLs: ['res/img/block.png'], events: []};
	if (options == null) {
		options = this.defaultOptions;
	}
	this.height = options.height || this.defaultOptions.height;
	this.width = options.width || this.defaultOptions.width;
	this.cellSize = options.cellSize || this.defaultOptions.cellSize;
	this.blocks = options.blocks || this.defaultOptions.blocks;
	this.blockURLs = options.blockURLs || this.defaultOptions.blockURLs;
	this.events = options.events || this.defaultOptions.events;
	
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

function Player() {
	
}

function event(options) {
	this.trig = options.trig;
	this.exec = options.exec;
}