function State(level) {
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
		this.gravity = 0.4;
		this.tileMap = new jaws.TileMap({size: [this.level.blocks[0].length, this.level.blocks.length], cell_size: [this.level.cellSize, this.level.cellSize]});
		this.tileMap.push(this.level.spriteList);
		this.width = this.level.blocks[0].length * this.level.cellSize;
		this.height = this.level.blocks.length * this.level.cellSize;
		this.viewport = new jaws.Viewport({max_x: this.width, max_y: this.height});
		this.bullets = new jaws.SpriteList();
		this.enemies = new jaws.SpriteList();
		//this.enemies.push(new Enemy1('res/img/sprites/enemy1.png',1008, 6367));
		//this.enemies.push(new Enemy1('res/img/sprites/enemy1.png', 1316, 5823.4));
		this.parallax1 = new jaws.Parallax({repeat_x: true, repeat_y: true});
		this.parallax1.addLayer({image: "res/img/misc/sky1.png", damping: 2});
		this.parallax2 = new jaws.Parallax({repeat_x: true});
		this.parallax2.addLayer({image: "res/img/misc/hill1.png", damping:2});
		this.emitters = new jaws.SpriteList();
	}
	this.update = function() {
		for (i in this.level.events) {
			if (this.level.events[i].trig()) {
				this.level.events[i].exec();
			}
		}
		player.move(this);
		this.viewport.centerAround(player);
		this.bullets.update();
		this.enemies.update();
		this.bullets.removeIf(isOutsideLevel);
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
}

function NPC(img, x, y) {
	this.__proto__ = new jaws.Sprite({x:x, y:y, image: img, anchor: 'center_bottom'});
	this.direction = -1;
	this.speed = 2;
	this.health = 3;
	this.toRemove = false;
	this.update = function() {
		var state = jaws.game_state;
		this.x += this.speed*this.direction;
		if (state.tileMap.atRect(this.rect()).length > 0) {
			var colliding = false;
			for (i in state.tileMap.atRect(this.rect())) {
				if (state.tileMap.atRect(this.rect())[i].rect().collideRect(this.rect()))
					colliding = true;
			}
			if (colliding)
				this.direction *= -1;
		}
	}
}

function Enemy1(img,x,y) {
	this.__proto__ = new NPC(img,x,y);
}

function Player() {
	var playerAnim = new jaws.Animation({sprite_sheet: "res/img/sprites/player.png", orientation:'right', frame_size: [280,640], frame_duration: 200});
	this.__proto__ = new jaws.Sprite({x:100, y:100, scale: .09, anchor:'center_bottom'});
	this.animDefault = playerAnim.slice(0,4);
	this.animLeft = playerAnim.slice(4,8);
	this.animRight = playerAnim.slice(4,8);
	this.animUp = playerAnim.slice(4,8);
	this.arm = new Arm(this);
	this.vy = 0;
	this.vx = 0;
	this.canJump = false;
	this.canFire = false;
	this.facingRight = true;
	window.setTimeout(function() {
		player.canFire = true;
	}, 200);
	this.move = function(state) {
		this.setImage(this.animDefault.next());
		
		this.vx = 0;
		if(jaws.pressed("left") || jaws.pressed('a')) {
			this.vx = -4;
			this.setImage(this.animLeft.next());
			this.flipped = true;
			this.arm.flipped = true;
		}
		if(jaws.pressed("right") || jaws.pressed('d')) {
			this.vx = 4;
			this.setImage(this.animRight.next());
			this.flipped = false;
			this.arm.flipped = false;
			
		}
		if(jaws.pressed("up") || jaws.pressed('w')) {
			if(this.canJump) {
				this.vy = -15;
				this.canJump = false;
			}
		}
		if(jaws.pressed('left_mouse_button')) {
			if (this.canFire) {
				var newBullet = new Bullet(this.arm.x, this.arm.y, state);
				state.bullets.push(newBullet);
				this.canFire = false;
				this.arm.setImage(this.arm.fired);
				window.setTimeout(function() {
					player.arm.setImage(player.arm.notFired);
				}, 400);
				window.setTimeout(function() {
					player.canFire = true;
				}, 1000);
				var gunshot = new buzz.sound('res/snd/gun.wav');
				gunshot.setVolume(5);
				gunshot.play();
			}
		}
		
		this.vy += state.gravity;
		
		this.x += this.vx;
		
		if (state.tileMap.atRect(this.rect()).length > 0) {
			var colliding = false;
			for (i in state.tileMap.atRect(this.rect())) {
				if (state.tileMap.atRect(this.rect())[i].rect().collideRect(this.rect()))
					colliding = true;
			}
			if (colliding)
				this.x -= this.vx;
		}
		this.vx = 0;
		
		this.y += this.vy;
		
		var block = state.tileMap.atRect(this.rect())[0];
		if (block) {
			// Heading downwards
			if (this.vy > 0) { 
				this.canJump = true;
				this.y = block.rect().y - 1;
			}
			// Heading upwards (jumping)
			else if (this.vy < 0) {
				this.y = block.rect().bottom + this.height;
			}
			this.vy = 0;
		}
		this.arm.x = this.x;
		this.arm.y = this.y-this.height/2;
		var angle = Math.atan2(jaws.mouse_y - this.arm.y + state.viewport.y, jaws.mouse_x - this.arm.x + state.viewport.x);
		this.arm.rotateTo(angle*180/Math.PI);
		if(this.arm.flipped)
			this.arm.rotate(180);
	}
}

function Arm(player) {
	var armAnim = new jaws.SpriteSheet({image: "res/img/sprites/arm.png", orientation:'down', frame_size: [298,75]})
	this.__proto__ = new jaws.Sprite({scale:.09, x:player.x+player.width/2, y:player.y+player.height/2, anchor:'left_center'});
	this.fired = armAnim.frames[1];
	this.notFired = armAnim.frames[0];
	this.setImage(this.notFired);
}

function Bullet(x, y, state) {
	this.__proto__ = new jaws.Sprite({image:'res/img/sprites/bullet.png', x:x, y:y});
	var angle = Math.atan2(jaws.mouse_y - player.arm.y + state.viewport.y, jaws.mouse_x - player.arm.x + state.viewport.x);
	this.rotateTo(angle*(180/Math.PI));
	this.dx = jaws.mouse_x+state.viewport.x - x;
        this.dy  = jaws.mouse_y+state.viewport.y - y;
        this.dx /= 10;
        this.dy /= 10;
	var vectorLength = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
        this.dx /= vectorLength;
        this.dy /= vectorLength;
        this.dx *= 30;
        this.dy *= 30;
        this.rectangle = new jaws.Rect(this.x,this.y,10,5);
	this.hitEnemy = false;
	this.toRemove = false;
	
	this.update = function() {
		this.x += this.dx;
                this.y += this.dy;
                this.rectangle = new jaws.Rect(this.x,this.y,10,10);
	}
	this.rect = function() {
                return this.rectangle;
        }
}

function event(options) {
	this.trig = options.trig;
	this.exec = options.exec;
}

function BloodEmitter(x,y,dx,dy) {
	this.__proto__ = new Emitter(x,y,dx,dy);
	for (var i = 0; i < 50; i++) {
		//var particleDX = ((Math.random()*2)-1) + (this.dx/40);
		//var particleDY = ((Math.random()*1.2)-.6) + (this.dy/40);
		var particleDX = ((Math.random()*(this.dx/this.dx))-.5)/2 + (this.dx/5);
		var particleDY = ((Math.random()*(this.dy/this.dy))-.5)/2 + (this.dy/5);
		this.particles.push(new BloodParticle(x,y,particleDX, particleDY, .03));
	}
}

function BloodParticle(x,y,dx,dy, gravity) {
	this.__proto__ = new Particle(x,y,dx,dy);
	this.r = 255;
	this.g = 0;
	this.b = 0;
	this.a = 1;
	this.gravity = gravity;
	this.size = Math.floor(Math.random()*5);
	this.update = function() {
		this.dy += this.gravity;
		this.x += this.dx;
		this.y += this.dy;
		this.a -= .025;
		if (this.a < 0)
			this.a = 0;
	}
}

function Emitter(x,y,dx,dy) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.particles = new jaws.SpriteList();
	this.update = function() {
		this.particles.update();
		this.particles.removeIf(isInvis);
	}
	this.draw = function() {
		this.particles.draw();
	}
}

function Particle(x,y,dx,dy) {
	this.r;
	this.g;
	this.b;
	this.a;
	this.age = 0;
	this.size = 10;
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.update = function() {
		this.x += this.dx;
		this.y += this.dy;
		this.age++;
	}
	this.draw = function() {
		jaws.context.beginPath();
		jaws.context.arc(this.x, this.y, this.size, 0, Math.PI*2, true);
		jaws.context.fillStyle = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
		jaws.context.fill();
	}
}