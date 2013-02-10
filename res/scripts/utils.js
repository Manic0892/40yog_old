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

function drawHealthBar(entity, x, y, height, width, color) {
	var rectWidth = entity.hp/entity.mhp * width;
	jaws.context.beginPath();
	jaws.context.rect(x, y, rectWidth, height);
	jaws.context.fillStyle = color;
	jaws.context.fill();
	jaws.context.beginPath();
	jaws.context.rect(x, y, width, height);
	jaws.context.strokeStyle = 'black';
	jaws.context.lineWidth = 1;
	jaws.context.stroke();
}

function drawPowerBar(entity, x, y, height, width, color) {
	var rectWidth = entity.p/entity.mp * width;
	jaws.context.beginPath();
	jaws.context.rect(x, y, rectWidth, height);
	jaws.context.fillStyle = color;
	jaws.context.fill();
	jaws.context.beginPath();
	jaws.context.rect(x, y, width, height);
	jaws.context.strokeStyle = 'black';
	jaws.context.lineWidth = 1;
	jaws.context.stroke();
}

function isOutsideLevel(entity) {
	if (entity.x < -200 || entity.y < -200 || entity.x > jaws.game_state.viewport.max_x+200 || entity.y > jaws.game_state.viewport.max_y+200) {
		return true;
	} else {
		return false;
	}
}

function isHittingBullet(entity) {
	var colliding = false;
	jaws.game_state.bullets.forEach(function(bullet) {
		if (bullet.rect().collideRect(entity.rect())) {
			colliding = true;
			bullet.toRemove = true;
			bullet.hitEnemy = true;
		}
	});
	return colliding;
}

function isHittingPlayer(entity) {
	var colliding = false;
	if (entity.rect().collideRect(player.rect())) {
		colliding = true;
	}
	return colliding;
}

function isHittingTile(entity) {
	var colliding = false;
	if(jaws.game_state.tileMap.atRect(entity.rect()).length > 0) {
		for (i in jaws.game_state.tileMap.atRect(entity.rect())) {
			if (jaws.game_state.tileMap.atRect(entity.rect())[i].rect().collideRect(entity.rect()))
				colliding = true;
		}
	}
	return colliding;
}

function isInvis(entity) {
	return entity.a <= 0;
}

function isHittingTilemap(entity) {
	return (jaws.game_state.tileMap.atRect(entity.rect()).length > 0);
}

function hitEnemy(entity) {
	return entity.hitEnemy;
}

function toRemoval(entity) {
	return entity.toRemove;
}

function particleLengthIsZero(entity) {
	return entity.particles.length == 0;
}

function collides(entity1, entity2) {
	return (entity1.collideRect(entity2.rect()));
}