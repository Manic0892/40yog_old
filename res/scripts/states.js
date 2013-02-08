var states = [];

var menuState = new function() {
	this.setup = function() {
		this.items = ['Start', 'Settings', 'Levels'];
		this.selected = 0;
		this.fontsize = 50;
		this.initoffset = 300;
		this.spacing = this.fontsize;
		this.menuImage = new Image();
		this.menuImage.src = 'res/img/misc/menu2.jpg';
	}
	this.update = function() {
		var mousey = jaws.mouse_y;
		var elements = this.items.length;
		var selection = Math.floor((mousey-this.initoffset+this.spacing)/(this.spacing));
		if (selection < 0)
			selection = 0;
		else if (selection > this.items.length-1)
			selection = this.items.length-1;
		this.selected = selection;
		if (jaws.pressed('left_mouse_button')) {
			if (this.selected == 0)
				jaws.switchGameState(states[states.index++]);
		}
	}
	this.draw = function() {
		jaws.clear();
		jaws.context.drawImage(this.menuImage,0,0);
		for(var i=0; this.items[i]; i++) {
			jaws.context.font = 'bold ' + this.fontsize + 'pt impact';
			jaws.context.lineWidth = 10;
			jaws.context.fillStyle =  (i == this.selected) ? 'Red' : 'Black';
			jaws.context.strokeStyle =  'rgba(200,200,200,0.0)';
			jaws.context.fillText(this.items[i], 650, this.initoffset + i * this.spacing);
		}
	}
}

function Level1(level) {
	this.setup = function() {
		this.level = level;
		this.paused = false;
		player = new Player();
		for (i in this.level.blocks) {
			for (j in this.level.blocks[i]) {
				if (this.level.blocks[i][j] == 'P') {
					player.x = j*this.level.cellSize;
					player.y = i*this.level.cellSize;
				}
			}
		}
		this.g = 0.4;
		this.vt = 20;
		this.tileMap = new jaws.TileMap({size: [this.level.blocks[0].length, this.level.blocks.length], cell_size: [this.level.cellSize, this.level.cellSize]});
		this.tileMap.push(this.level.spriteList);
		this.width = this.level.blocks[0].length * this.level.cellSize;
		this.height = this.level.blocks.length * this.level.cellSize;
		this.viewport = new jaws.Viewport({max_x: this.width, max_y: this.height});
		this.bullets = new jaws.SpriteList();
		this.enemies = new jaws.SpriteList();
		this.enemies.push(new Bedbug(1008, 6367));
		this.enemies.push(new Bedbug(1316, 5823));
		this.parallax1 = new jaws.Parallax({repeat_x: true, repeat_y: true});
		this.parallax1.addLayer({image: 'res/img/misc/sky1.png', damping: 2});
		this.parallax2 = new jaws.Parallax({repeat_x: true});
		this.parallax2.addLayer({image: 'res/img/misc/hill1.png', damping:2});
		this.emitters = new jaws.SpriteList();
		player.health = 100;
	}
	this.update = function() {
		for (i in this.level.events) {
			if (this.level.events[i].trig()) {
				this.level.events[i].exec();
			}
		}
		
		if (Math.floor(Math.random()*100) == 0) {
			var x = Math.floor(Math.random()*this.level.blocks[0].length*this.level.cellSize);
			var y = Math.floor(Math.random()*this.level.blocks.length*this.level.cellSize);
			this.enemies.push(new Bedbug(x,y));
		}
		
		player.move(this);
		this.viewport.centerAround(player);
		this.bullets.update();
		this.enemies.update();
		this.bullets.removeIf(isOutsideLevel);
		this.enemies.removeIf(isOutsideLevel);
		this.bullets.removeIf(isHittingTile);
		this.bullets.removeIf(toRemoval);
		this.enemies.forEach(function(entity) {
			if (isHittingBullet(entity)) {
				entity.health--;
				if (entity.health <= 0) {
					entity.toRemove = true;
				}
			}
		});
		this.bullets.forEach(function(bullet) {
			if (bullet.hitEnemy) {
				jaws.game_state.emitters.push(new BloodEmitter(bullet.x, bullet.y, bullet.dx, bullet.dy));
			}
		});
		this.emitters.removeIf(particleLengthIsZero);
		this.emitters.update();
		this.enemies.removeIf(toRemoval);
		this.parallax1.camera_x = this.viewport.x;
		this.parallax1.camera_y = this.viewport.y;
		this.parallax2.camera_x = this.viewport.x;
		this.parallax2.camera_y = this.viewport.y-6000;
	}
	this.draw = function() {
		jaws.clear();
		var state = this;
		this.parallax1.draw();
		this.parallax2.draw();
		this.viewport.apply(function() {
			state.level.spriteList.draw();
			state.bullets.draw();
			state.enemies.draw();
			player.draw();
			player.arm.draw();
			state.emitters.draw();
		});
	}
	this.specFunc = function() {
		if (jaws.pressed('space')) {
			this.enemies.forEach(this.testRange);
				
		}
	}
	this.testRange = function(entity) {
		if (entity.x < player.x + 500 && entity.x >= player.x - 500 && entity.y < player.y + 500 && entity.y >= player.y - 500) {
			entity.toRemove = true;
		}
	}
}