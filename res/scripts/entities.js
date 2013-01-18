function State(level) {
	this.setup = function() {
		this.level = level;
		this.paused = false;
		player = new Player();
		arm = new Arm();
	}
	this.update = function() {
		for (i in this.level.events) {
			if (this.level.events[i].trig()) {
				this.level.events[i].exec();
			}
		}
		player.setImage( player.anim_default.next() );
		if(jaws.pressed("left"))  { player.x -= 5; player.setImage( player.anim_left.next() ) };
		if(jaws.pressed("right")) { player.x += 5; player.setImage( player.anim_right.next() ) };
		if(jaws.pressed("up"))    { player.y -= 5; player.setImage( player.anim_up.next() ) };
		if(jaws.pressed("down"))  { player.y += 5; player.setImage( player.anim_default.next() ) };
		arm.x = player.x+player.width/2;
                arm.y = player.y+player.height/4;
                var angle = Math.atan2(jaws.mouse_y - arm.y, jaws.mouse_x - arm.x);
                //var angle = calcAngle({x:arm.x, y:arm.y},{x:jaws.mouse_x, y:jaws.mouse_y});
                arm.rotateTo(angle*(180/Math.PI));
	}
	this.draw = function() {
		jaws.clear();
		this.level.spriteList.draw();
		player.draw();
		arm.draw();
	}
}

function Player() {
	var playerAnim = new jaws.Animation({sprite_sheet: "res/img/dummy.png", orientation:'right', frame_size: [32,64], frame_duration: 100});
	this.__proto__ = new jaws.Sprite({x:100, y:100, scale: 1});
	this.anim_default = playerAnim.slice(0,3);
	this.anim_left = playerAnim.slice(3,5);
	this.anim_right = playerAnim.slice(5,7);
	this.anim_up = playerAnim.slice(7,9);
}

function Arm() {
	 this.__proto__ = new jaws.Sprite({image: 'res/img/arm.png', x:player.x+player.width/2, y:player.y+player.height/2, scale:1, anchor:'left_center'});
}

function event(options) {
	this.trig = options.trig;
	this.exec = options.exec;
}