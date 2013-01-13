function world(options) {
	this.defaultOptions = {width: 5, height: 5, cellSize: 32};
	if (options == null) {
		options = this.defaultOptions;
	}
	this.height = options.height;
	this.width = options.width;
	this.cellSize = options.cellSize;
	this.blocks = [[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1]];
	this.blockURLs = ['res/img/block.png'];
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

function level(options) {
	this.defaultOptions = {cellSize: 32};
	if (options == null) {
		options = this.defaultOptions;
	}
	this.world = new world();
	this.cellSize = options.cellSize || 32;
	this.events = [];
}

function coord(x,y) {
	this.x = x;
	this.y = y;
}

function event(options) {
	this.trig = options.trig;
	this.exec = options.exec;
}

function blockType(url) {
	this.url = url;
	this.coords = [];
}

function State(options) {
	this.setup = function() {
		this.level = new level();
		this.level.world.build();
		this.paused = false;
		this.level.events.push({trig: function() {
			return jaws.pressed('w');
		}, exec: function() {
			console.log('success');
		}});
	}
	this.update = function() {
		for (i in this.level.events) {
			if (this.level.events[i].trig()) {
				this.level.events[i].exec();
			}
		}
		if (jaws.pressed('esc') && canPause == true) {
			this.paused = !this.paused;
			canPause = false;
			window.setTimeout(function() {
				canPause = true;
			}, 600);
		}
		console.log(canPause);
	}
	this.draw = function() {
		jaws.clear();
		this.level.world.spriteList.draw();
	}
}