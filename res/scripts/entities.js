function State(level) {
	this.setup = function() {
		this.level = level;
		this.paused = false;
		var playerAnim = new jaws.Animation({sprite_sheet: "res/img/dummy.png", orientation:'right', frame_size: [32,64], frame_duration: 100});
	
		player = new jaws.Sprite({x:100, y:100, scale: 1, anchor: "center_bottom"});
		player.anim_default = playerAnim.slice(0,3);
		player.anim_left = playerAnim.slice(3,5);
		player.anim_right = playerAnim.slice(5,7);
		player.anim_up = playerAnim.slice(7,9);
	}
	this.update = function() {
		for (i in this.level.events) {
			if (this.level.events[i].trig()) {
				this.level.events[i].exec();
			}
		}
		player.setImage( player.anim_default.next() )
		if(jaws.pressed("left"))  { player.x -= 5; player.setImage( player.anim_left.next() ) }
		if(jaws.pressed("right")) { player.x += 5; player.setImage( player.anim_right.next() ) }
		if(jaws.pressed("up"))    { player.y -= 5; player.setImage( player.anim_up.next() ) }
		if(jaws.pressed("down"))  { player.y += 5; player.setImage( player.anim_default.next() ) }
	}
	this.draw = function() {
		jaws.clear();
		this.level.spriteList.draw();
		player.draw();
	}
}

function Level(options) {
	this.defaultOptions = {cellSize: 32, height: 5, width: 5, blocks: [[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1]], blockURLs: ['res/img/block.png'], events: []};
	if (options == null) {
		options = this.defaultOptions;
	}
	this.height = options.height || this.defaultOptions.height;
	this.width = options.width || this.defaultOptions.width;
	this.cellSize = options.cellSize || this.defaultOptions.cellSize;
	this.blocks = options.blocks || this.defaultOptions.blocks;
	this.blockURLs = options.blockURLs || this.defaultOptions.blockURLs;
	this.events = options.events || this.defaultOptions.events;
	
	this.build = function() {
		this.spriteList = new jaws.SpriteList();
		for (i in this.blocks) {
			for (j in this.blocks[i]) {
				if (this.blocks[i][j] != 0)
					this.spriteList.push(new jaws.Sprite({image:levels.blockURLs[this.blocks[i][j]-1],x:j*this.cellSize, y:i*this.cellSize}));
			}
		}
	}
}

function Player() {
	
}

function event(options) {
	this.trig = options.trig;
	this.exec = options.exec;
}