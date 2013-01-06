var stage;
var mainLayer;
var gameState;

var player;
var canvas;
var context;
var bullets;

var speed = 4;
var bulletSpeed = 13;
var gravity = 0.2;
var arm;
var viewport;
var tile_map;


window.onload = function() {
	jaws.unpack();
	jaws.assets.add('res/plane.png');
	jaws.assets.add('res/bullet.png');
	jaws.assets.add('res/droid.png');
	jaws.assets.add('res/droidarm.png');
	jaws.assets.add('res/block.png');
	jaws.start(menuState);
}

function playState() {
	viewport = new jaws.Viewport({max_x: 3200, max_y: 3200})
	this.setup = function () {
		canvas = $('#gamePlay')[0];
		
		bullets = new jaws.SpriteList();
		particles = new jaws.SpriteList();
		context = canvas.getContext('2d');
		
		var anim = new jaws.Animation({sprite_sheet: "res/droid.png", frame_size: [11,15], frame_duration: 100});
		
		player = new jaws.Sprite({x:100, y:300, scale: 2});
		
		player.anim_default = anim.slice(0,5);
		player.anim_up = anim.slice(6,8);
		player.anim_down = anim.slice(8,10);
		player.anim_left = anim.slice(10,12);
		player.anim_right = anim.slice(12,14);
	      
		player.setImage(player.anim_default.next());
		
		jaws.context.mozImageSmoothingEnabled = false;
		
		arm = new jaws.Sprite({image: 'res/droidarm.png', x:player.x+player.width/2, y:player.y+player.height/2, scale:2, anchor:'left_center'});
		
		
		player.canFire = true;
		jaws.on_keydown('esc', function() {jaws.switchGameState(menuState)});
		jaws.preventDefaultKeys(['up', 'down', 'left', 'right', 'space']);
		
		blocks = new jaws.SpriteList();
		blocks.push( new jaws.Sprite({image: 'res/block.png', x: 0, y: 0}) );
		blocks.push( new jaws.Sprite({image: 'res/block.png', x: 64, y: 64}) );
		blocks.push( new jaws.Sprite({image: 'res/block.png', x: 128, y: 64}) );
		blocks.push( new jaws.Sprite({image: 'res/block.png', x: 128, y: 128}) );
		tile_map = new jaws.TileMap({size: [10,10], cell_size: [32,32]});
		tile_map.push(blocks);
		//console.log(tile_map.toString());
	}
	
	this.update = function() {
		if (jaws.pressed('left_mouse_button')) {
			if (player.canFire) {
				bullets.push(new Bullet(arm.x, arm.y-arm.height/2, jaws.mouse_x+viewport.x, jaws.mouse_y+viewport.y));
				player.canFire = false;
				window.setTimeout(function() {player.canFire = true;}, 600);
			}
		}
		player.setImage(player.anim_default.next());
		if(jaws.pressed('left')) {
			player.setImage(player.anim_left.next());
			player.x -= speed;
			//if (tile_map.atRect(player.rect()).length > 0) {player.x += speed;}
			if (isHittingTilemap(player))
				player.x += speed;
		}
		if(jaws.pressed('right')) {
			player.setImage(player.anim_right.next());
			player.x += speed;
			//if (tile_map.atRect(player.rect()).length > 0) {player.x -= speed;}
			if (isHittingTilemap(player))
				player.x -= speed;
		}
		if(jaws.pressed('up')) {
			player.setImage(player.anim_up.next());
			player.y -= speed;
			//if (tile_map.atRect(player.rect()).length > 0) {player.y += speed;}
			if (isHittingTilemap(player))
				player.y += speed;
		}
		if(jaws.pressed('down')) {
			player.setImage(player.anim_down.next());
			player.y += speed;
			//if (tile_map.atRect(player.rect()).length > 0) {player.y -= speed;}
			if (isHittingTilemap(player))
				player.y -= speed;
		}
		arm.x = player.x+player.width/2;
		arm.y = player.y+player.height/4;
		var angle = Math.atan2(jaws.mouse_y - arm.y+viewport.y, jaws.mouse_x - arm.x + viewport.x);
		//var angle = calcAngle({x:arm.x, y:arm.y},{x:jaws.mouse_x, y:jaws.mouse_y});
		arm.rotateTo(angle*60);
		//console.log(angle*60);
		//if(jaws.pressed('space')) {
		//	if (player.canFire) {
		//		bullets.push(new Bullet(player.rect().right, player.y+13));
		//		player.canFire = false;
		//		window.setTimeout(function() {player.canFire = true;}, 600);
		//	}
		//	//for (var i = 0; i < 7; i++)
		//	//	particles.push(new Particle(player.x, player.y, (Math.floor(Math.random()*20)-10)/5, (Math.floor(Math.random()*-10+5))/.7));
		//}
		
		forceInsideCanvas(player); 
		bullets.removeIf(isOutsideCanvas);
		viewport.centerAround(player);
		bullets.removeIf(isHittingTilemap);
		//console.log(tile_map.atRect(player.rect()).length);
		//console.log(player.rect().toString());
		
		//particles.removeIf(isOutsideCanvas);
		
		//TODO: MAKE BULLETS COME OUT OF GUN.  DO THIS BY MAKING SPRITE WHERE BEGINNING OF ARM AND GUN ARE AT THE EXACT SAME Y COORDINATE.  TEST.  ALSO MAKE SURE YOU CAN DRAW ALONG THE DIRECTION VECTOR O HE POINT WHERE THE GUN SHOULD BE, THEN SPAWN THE BULLET THERE.
		//AAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHH
	}
	
	this.draw = function() {
		jaws.clear();        // Same as: context.clearRect(0,0,jaws.width,jaws.height)
		//player.draw();
		//bullets.draw();  // will call draw() on all items in the list
		//arm.draw();
		viewport.apply(function() {
			player.draw();
			bullets.draw();
			arm.draw();
			blocks.draw();
		});
		//console.log(jaws.game_loop.fps);
		//console.log(bullets.length)
		//particles.draw();
	}
}

function menuState() {
	var index = 0;
	var items = ["Start", "Settings", "High Score"];
	
	this.setup = function() {
		index = 0;
		jaws.on_keydown(["down","s"],       function()  { index++; if(index >= items.length) {index=0} } );
		jaws.on_keydown(["up","w"],         function()  { index--; if(index < 0) {index=items.length-1} } );
		jaws.on_keydown(["enter","space"],  function()  { if(items[index]=="Start") {jaws.switchGameState(playState) } } );
	}
	
	this.draw = function() {
		jaws.clear();
		for(var i=0; items[i]; i++) {
			// jaws.context.translate(0.5, 0.5)
			if (i != index) {
				jaws.context.font = "bold 100pt impact";
				jaws.context.lineWidth = 10;
				jaws.context.fillStyle =  (i == index) ? "Red" : "Black";
				jaws.context.strokeStyle =  "rgba(200,200,200,0.0)";
				jaws.context.fillText(items[i], 30, 120 + i * 80);
			}
		}
		jaws.context.font = "bold 100pt impact";
		jaws.context.lineWidth = 10;
		jaws.context.fillStyle = "Red";
		jaws.context.strokeStyle =  "rgba(200,200,200,0.0)";
		jaws.context.fillText(items[index], 30, 120+index*80);
	}
}

function isOutsideCanvas(item) {
	return (item.x < 0 || item.y < 0 || item.x > viewport.max_x || item.y > viewport.max_y);
}

function isHittingTilemap(item) {
	return (tile_map.atRect(item.rect()).length > 0);
}


function forceInsideCanvas(item) {
	if(item.x < 0) item.x = 0;
	if(item.x + item.width > canvas.width) item.x = canvas.width - item.width;
	if(item.y < 0) item.y = 0;
	if(item.y + item.height  > canvas.height) item.y = canvas.height - item.height;
}

//objects

/* Our simple bullet class, basically a circle with a position (x/y) */
function Bullet(x, y, mousex, mousey) {
	this.dx = mousex - x;
	this.dy  = mousey - y;
	this.dx /= 10;
	this.dy /= 10;
	var vectorLength = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
	this.dx /= vectorLength;
	this.dy /= vectorLength;
	this.dx *= bulletSpeed;
	this.dy *= bulletSpeed;
	this.x = x;
	this.y = y;
	this.rectangle = new jaws.Rect(this.x,this.y,10,10);
	this.draw = function() {
		this.x += this.dx;
		this.y += this.dy;
		jaws.context.drawImage(jaws.assets.get("res/bullet.png"), this.x-5, this.y-5);
		this.rectangle = new jaws.Rect(this.x,this.y,10,10);
	}
	this.rect = function() {
		return this.rectangle;
	}
}

//function Particle(x,y,xdir, ydir) {
//	this.x = x;
//	this.y = y;
//	this.xdir = xdir;
//	this.ydir = ydir;
//	this.draw = function() {
//		this.ydir += gravity;
//		this.y += this.ydir;
//		if (this.xdir > 0) this.xdir -= 1;
//		this.x += xdir;
//		context.beginPath();
//		context.arc(this.x, this.y, 2, 0, Math.PI*2, true); 
//		context.stroke();
//	}
//}