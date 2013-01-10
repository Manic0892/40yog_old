function world() {
	this.height;
	this.width;
	this.blocks = [];
	this.createBlocks = new function(url, coords) {
		this.blocks.push(new blockType(url));
		this.blocks[length-1].coords = coords;
	}
}

function level() {
	this.world = new world();
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