function NPC(x, y) {
	this.__proto__ = new jaws.Sprite({x:x, y:y});
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

function Bedbug(x,y) {
	this.__proto__ = new jaws.Sprite({x:x, y:y, scale:.2, anchor:'center'});
	this.anim = new jaws.Animation({sprite_sheet: 'res/img/sprites/enemies/bedbug.png', orientation:'right', frame_size: [257,216], frame_duration:700});
	this.toRemove = false;
	this.speed = 3;
	this.health = 1;
	this.vx = 0;
	this.vy = 0;
	this.damage = 5;
	this.setImage(this.anim.next());
	this.update = function() {
		var state = jaws.game_state;
		if (this.vy < state.vt)
			this.vy += state.g;
		this.vx = 0;
		if (isHittingTilemap(this)) {
			if (player.x >= this.x + 5) {
				this.vx = this.speed;
			} else if (player.x < this.x - 5) {
				this.vx = -this.speed;
			}
			this.vy = 0;
			if (player.y >= this.y + 5) {
					this.vy = this.speed;
			} else if (player.y < this.y - 5) {
				if (state.tileMap.at(this.x, this.y).length > 0) {
					this.vy = -this.speed;
				}
			}
		}
		this.x += this.vx;
		this.y += this.vy;
		this.setImage(this.anim.next());
		if (isHittingPlayer(this)) {
			this.toRemove = true;
			player.hit(this.damage);
		}
	}
}

function Player() {
	var playerAnim = new jaws.Animation({sprite_sheet: 'res/img/sprites/player/player.png', orientation:'right', frame_size: [280,640], frame_duration: 200});
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
	this.health = 100;
	this.invincible = false;
	window.setTimeout(function() {
		player.canFire = true;
	}, 200);
	this.move = function(state) {
		this.setImage(this.animDefault.next());
		
		this.vx = 0;
		if(jaws.pressed('left') || jaws.pressed('a')) {
			this.vx = -4;
			this.setImage(this.animLeft.next());
			this.flipped = true;
			this.arm.flipped = true;
		}
		if(jaws.pressed('right') || jaws.pressed('d')) {
			this.vx = 4;
			this.setImage(this.animRight.next());
			this.flipped = false;
			this.arm.flipped = false;
			
		}
		if(jaws.pressed('up') || jaws.pressed('w')) {
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
		this.hit = function(damage) {
			if (!this.invincible) {
				this.health -= damage;
				this.invincible = true;
				window.setTimeout(function() {
					player.invincible = false;
				}, 4000);
			}
			console.log(this.health);
		}
		state.specFunc();
		
		if (this.vy < state.vt)
			this.vy += state.g;
		
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
	var armAnim = new jaws.SpriteSheet({image: 'res/img/sprites/player/arm.png', orientation:'down', frame_size: [298,75]})
	this.__proto__ = new jaws.Sprite({scale:.09, x:player.x+player.width/2, y:player.y+player.height/2, anchor:'left_center'});
	this.fired = armAnim.frames[1];
	this.notFired = armAnim.frames[0];
	this.setImage(this.notFired);
}

function Bullet(x, y, state) {
	this.__proto__ = new jaws.Sprite({image:'res/img/sprites/misc/bullet.png', x:x, y:y});
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