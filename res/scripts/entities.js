function world(options) {
	this.defaultOptions = {width: 500, height: 500, cellSize: 32};
	if (options == null) {
		options = this.defaultOptions;
	}
	this.height = options.height;
	this.width = options.width;
	this.cellSize = options.cellSize;
	this.blocks = [1,1,1
		       ];
	this.blockURLs = [];
}

function level(options) {
	if (options == null) {
		options = {cellSize:32};
	}
	//this.world = new world();
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