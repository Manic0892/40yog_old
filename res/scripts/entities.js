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
					this.spriteList.push(new jaws.Sprite({image:this.blockURLs[this.blocks[i][j]-1],x:j*32, y:i*32}));
			}
		}
	}
}

function level(options) {
	if (options == null) {
		options = {cellSize:32};
	}
	this.world = new world();
	this.cellSize = options.cellSize || 32;
	this.events = [];
}

function coord(x,y) {
	this.x = x;
	this.y = y;
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
	}
	this.update = function() {
		if (jaws.pressed('esc'))
			this.paused = !this.paused;
		console.log(this.paused);
	}
	this.draw = function() {
		jaws.clear();
		this.level.world.spriteList.draw();
	}
}