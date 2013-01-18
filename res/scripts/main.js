window.onload = function() {
	var assetList = [];
	assetList.push('res/img/dummy.png');
	assetList.push('res/img/arm.png');
	for (var j in levels.blockURLs)
		assetList.push(levels.blockURLs[j]);
	jaws.assets.add(assetList);
	jaws.start(states[0]);
	
	
	for (i in levels.lvls) {
		//levels.lvls[i].build = function() {
		//	this.spriteList = new jaws.SpriteList();
		//	for (j in this.blocks) {
		//		for (k in this.blocks[j]) {
		//			if (this.blocks[j][k] != 0)
		//				this.spriteList.push(new jaws.Sprite({image:levels.blockURLs[this.blocks[j][k]-1],x:k*this.cellSize, y:j*this.cellSize}));
		//		}
		//	}
		//};
		states.push(new State(buildLevel(levels.lvls[i])));
	}
}