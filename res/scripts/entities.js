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
		this.bullets.removeIf(isOutsideLevel);
		this.bullets.removeIf(isHittingTile);
	}
	this.draw = function() {
		jaws.clear();
		var state = this;
		this.viewport.apply(function() {
			state.level.spriteList.draw();
			state.bullets.draw();
			player.draw();
			player.arm.draw();
		});
		console.log(this.bullets.length);
	}
}

function applyViewport(state) {
	
}

function Player() {
	var playerAnim = new jaws.Animation({sprite_sheet: "res/img/sprites/dummy.png", orientation:'right', frame_size: [32,64], frame_duration: 100});
	this.__proto__ = new jaws.Sprite({x:100, y:100, scale: 1, anchor:'center_bottom'});
	this.animDefault = playerAnim.slice(0,3);
	this.animLeft = playerAnim.slice(3,5);
	this.animRight = playerAnim.slice(5,7);
	this.animUp = playerAnim.slice(7,9);
	this.arm = new Arm(this);
	this.vy = 0;
	this.vx = 0;
	this.canJump = false;
	this.canFire = true;
	this.move = function(state) {
		this.setImage(this.animDefault.next());
		
		this.vx = 0;
		if(jaws.pressed("left") || jaws.pressed('a')) {
			this.vx = -4;
			this.setImage(this.animLeft.next());
		}
		if(jaws.pressed("right") || jaws.pressed('d')) {
			this.vx = 4;
			this.setImage(this.animRight.next());
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
				window.setTimeout(function() {
					player.canFire = true;
				}, 200);
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
		this.arm.y = this.y-this.height/2+10;
		var angle = Math.atan2(jaws.mouse_y - this.arm.y + state.viewport.y, jaws.mouse_x - this.arm.x + state.viewport.x);
		this.arm.rotateTo(angle*180/Math.PI);
	}
}

function Arm(player) {
	 this.__proto__ = new jaws.Sprite({image: 'res/img/sprites/arm.png', x:player.x+player.width/2, y:player.y+player.height/2, scale:1, anchor:'left_center'});
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
        this.dx *= 20;
        this.dy *= 20;
        this.rectangle = new jaws.Rect(this.x,this.y,10,5);
	
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