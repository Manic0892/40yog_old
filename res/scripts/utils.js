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

function isOutsideLevel(entity) {
	if (entity.x < 0 || entity.y < 0 || entity.x > jaws.game_state.viewport.max_x || entity.y > jaws.game_state.viewport.max_y) {
		return true;
	} else {
		return false;
	}
}

function isHittingTilemap(entity) {
	return (jaws.game_state.tileMap.atRect(entity.rect()).length > 0);
}

function collides(entity1, entity2) {
	return (entity1.collideRect(entity2.rect()));
}