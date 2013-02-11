var states = [];

var menuState = new function() {
	this.setup = function() {
		this.items = ['Continue', 'New Game', 'Level Select', 'Settings'];
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
			if (this.selected == 1)
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
		this.parallax1.addLayer({image: 'res/img/misc/nightsky.png', damping: 4});
		this.parallax2 = new jaws.Parallax({repeat_x: true});
		this.parallax2.addLayer({image: 'res/img/misc/nighthill.png', damping: 2});
		this.emitters = new jaws.SpriteList();
		player.health = 100;
		this.music = new buzz.sound('res/snd/pulse.mp3');
		this.sunSound = new buzz.sound('res/snd/sun.wav');
		this.music.setVolume(5);
		this.music.play();
		this.sunSound.play();
		this.sunSound.loop();
		this.sun = new Sun();
		this.drawSun = false;
		this.events = [];
		this.powerups = new jaws.SpriteList();
		
		this.events.push(new Event({trig: function() {
				if (player.x > 4000 && player.x < 5000 && player.y > 1000 && player.y < 1300)
					return true;
				else
					return false;
			}, exec: function() {
				jaws.game_state.setdown();
				//jaws.game_state.setup();
				states.index--;
				jaws.switchGameState(states[0]);
			}
		}));
		
		this.powerups.push(new HealthUp(808, 1500));
		this.powerups.push(new HealthUp(400, 1500));
		this.powerups.push(new SunUp(450, 1500));
		this.powerups.push(new SunUp(475, 1500));
		this.powerups.push(new SunUp(825, 1500));
	}
	this.update = function() {
		for (i in this.events) {
			if (this.events[i].trig()) {
				this.events[i].exec();
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
		this.sun.update();
		this.powerups.update();
		this.bullets.removeIf(isOutsideLevel);
		this.powerups.removeIf(toRemoval);
		this.enemies.removeIf(isOutsideLevel);
		this.bullets.removeIf(isHittingTile);
		this.bullets.removeIf(toRemoval);
		this.enemies.forEach(function(entity) {
			if (isHittingBullet(entity)) {
				entity.hp--;
				if (entity.hp <= 0) {
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
		this.parallax2.camera_y = this.viewport.y-1400;
		this.sunSound.unmute();
		this.sunSound.mute();
		this.drawSun = false;
		this.sunSound.mute();
		if (jaws.pressed('space') && this.sun.p > 0) {
			this.enemies.forEach(this.testRange);
			this.drawSun = true;
			this.sunSound.unmute();
		}
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
			state.powerups.draw();
			player.draw();
			player.arm.draw();
			state.emitters.draw();
			if (state.drawSun) {
				state.sun.draw(state);
			}
		});
		
		drawHealthBar(player, 10,10, 20, 100, 'red');
		drawPowerBar(state.sun, 10,40, 20, 100, 'yellow');
	}
	this.testRange = function(entity) {
		if (entity.x < player.x + 1000 && entity.x >= player.x - 1000 && entity.y < player.y + 1000 && entity.y >= player.y - 1000) {
			entity.toRemove = true;
		}
	}
	this.setdown = function() {
		this.music.stop();
		this.sunSound.stop();
	}
}