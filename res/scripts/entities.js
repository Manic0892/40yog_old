function world() {
	this.height;
	this.width;
	this.blocks;
}

function coord(x,y) {
	this.x = x;
	this.y = y;
}

function blockType(url) {
	this.url = url;
	this.coords = [];
}