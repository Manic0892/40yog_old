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
		this.gravity = .4;
		this.tileMap = new jaws.TileMap({size: [this.level.blocks[0].length, this.level.blocks.length], cell_size: [this.level.cellSize, this.level.cellSize]});
		this.tileMap.push(this.level.spriteList);
		this.width = this.level.blocks[0].length * this.level.cellSize;
		this.height = this.level.blocks.length * this.level.cellSize;
		this.viewport = new jaws.Viewport({max_x: this.width, max_y: this.height});
	}
	this.update = function() {
		for (i in this.level.events) {
			if (this.level.events[i].trig()) {
				this.level.events[i].exec();
			}
		}
		player.move(this);
		this.viewport.centerAround(player);
	}
	this.draw = function() {
		jaws.clear();
		var state = this;
		this.viewport.apply(function() {
			state.level.spriteList.draw();
			player.draw();
			player.arm.draw();
		});
	}
}

function applyViewport(state) {
	
}

function Player() {
	var playerAnim = new jaws.Animation({sprite_sheet: "res/img/sprites/dummy.png", orientation:'right', frame_size: [32,64], frame_duration: 100});
	this.__proto__ = new jaws.Sprite({x:100, y:100, scale: 1, anchor:'center_bottom'});
	this.anim_default = playerAnim.slice(0,3);
	this.anim_left = playerAnim.slice(3,5);
	this.anim_right = playerAnim.slice(5,7);
	this.anim_up = playerAnim.slice(7,9);
	this.arm = new Arm(this);
	this.vy = 0;
	this.vx = 0;
	this.canJump = false;
	this.move = function(state) {
		this.setImage( this.anim_default.next() )
		
		this.vx = 0
		if(jaws.pressed("left"))  { this.vx = -4; this.setImage(this.anim_left.next()) }
		if(jaws.pressed("right")) { this.vx = 4;  this.setImage(this.anim_right.next()) }
		if(jaws.pressed("up"))    { if(this.canJump) { this.vy = -10; this.canJump = false } }
		
		// some gravity
		this.vy += 0.4
		//this.vy += state.gravity;
		//
		//this.setImage(this.anim_default.next());
		//
		//if(jaws.pressed("left")) {
		//	this.vx -= .3;
		//	this.setImage(this.anim_left.next());
		//};
		//if(jaws.pressed("right")) {
		//	this.vx += .3;
		//	this.setImage(this.anim_right.next());
		//};
		//if(jaws.pressed("up")) {
		//	this.vy = -5;
		//	this.setImage(this.anim_up.next());
		//};
		//if(jaws.pressed("down")) {
		//	this.vy = 5;
		//	this.setImage(this.anim_default.next());
		//};
		//
		//this.x += this.vx;
		//this.y += this.vy;
		//
		
		this.x += this.vx
		if(state.tileMap.atRect(this.rect()).length > 0) { 
			this.x -= this.vx 
		}
		this.vx = 0
		
		this.y += this.vy
		var block = state.tileMap.atRect(this.rect())[0]
		if(block) { 
		// Heading downwards
		if(this.vy > 0) { 
		this.canJump = true 
		this.y = block.rect().y - 1
		}
		// Heading upwards (jumping)
		else if(this.vy < 0) {
		this.y = block.rect().bottom + this.height
		}
		this.vy = 0
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

function event(options) {
	this.trig = options.trig;
	this.exec = options.exec;
}