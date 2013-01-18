function buildLevel(lvl) {
	lvl.spriteList = new jaws.SpriteList();
	for (i in lvl.blocks) {
		for (j in lvl.blocks[i]) {
			if (lvl.blocks[i][j] != 'X' && lvl.blocks[i][j] != 'P') {
				lvl.spriteList.push(new jaws.Sprite({image:levels.blockURLs[lvl.blocks[i][j]], x:j*lvl.cellSize, y:i*lvl.cellSize}));
			}
		}
	}
	return lvl;
}