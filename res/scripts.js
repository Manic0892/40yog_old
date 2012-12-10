var stage;
var mainLayer;
var gameState;

var player;
var canvas;
var context;
var bullets;

var speed = 5;
var bulletSpeed = 7;
var gravity = 0.2;


window.onload = function() {
	jaws.assets.add('res/plane.png');
	jaws.assets.add('res/bullet.png');
	startGame();
}

function startGame() {
	gameState = new menuState();
	jaws.start(gameState);
}

function playState() {
	this.setup = function () {
		canvas = $('#gamePlay')[0];
		
		bullets = new jaws.SpriteList();
		particles = new jaws.SpriteList();
		context = canvas.getContext('2d');
		
		player = new jaws.Sprite({image: 'res/plane.png', x: 0, y:0, context: context});
		player.canFire = true;
		jaws.on_keydown('esc', function() {jaws.switchGameState(menuState)});
		jaws.preventDefaultKeys(['up', 'down', 'left', 'right', 'space']);
	}
	
	this.update = function() {
		if(jaws.pressed('left')) player.x -= speed;
		if(jaws.pressed('right')) player.x += speed;
		if(jaws.pressed('up')) player.y -= speed;
		if(jaws.pressed('down')) player.y += speed;
		if(jaws.pressed('space')) {
			if (player.canFire) {
				bullets.push(new Bullet(player.rect().right, player.y+13));
				player.canFire = false;
				window.setTimeout(function() {player.canFire = true;}, 600);
			}
			//for (var i = 0; i < 7; i++)
			//	particles.push(new Particle(player.x, player.y, (Math.floor(Math.random()*20)-10)/5, (Math.floor(Math.random()*-10+5))/.7));
		}
		forceInsideCanvas(player); 
		bullets.removeIf(isOutsideCanvas);
		//particles.removeIf(isOutsideCanvas);
	}
	
	this.draw = function() {
		jaws.clear();        // Same as: context.clearRect(0,0,jaws.width,jaws.height)
		player.draw();
		bullets.draw();  // will call draw() on all items in the list
		//particles.draw();
	}
}

function menuState() {
	var index = 0;
	var items = ["Start", "Settings", "Highscore"];
	
	this.setup = function() {
		index = 0;
		jaws.on_keydown(["down","s"],       function()  { index++; if(index >= items.length) {index=items.length-1} } );
		jaws.on_keydown(["up","w"],         function()  { index--; if(index < 0) {index=0} } );
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
	return (item.x < 0 || item.y < 0 || item.x > canvas.width || item.y > canvas.height);
}

function forceInsideCanvas(item) {
	if(item.x < 0) item.x = 0;
	if(item.x + item.width > canvas.width) item.x = canvas.width - item.width;
	if(item.y < 0) item.y = 0;
	if(item.y + item.height  > canvas.height) item.y = canvas.height - item.height;
}

//objects

/* Our simple bullet class, basically a circle with a position (x/y) */
function Bullet(x, y) {
	this.x = x;
	this.y = y;
	this.draw = function() {
		this.x += bulletSpeed;
		jaws.context.drawImage(jaws.assets.get("res/bullet.png"), this.x, this.y)
	}
}

function Particle(x,y,xdir, ydir) {
	this.x = x;
	this.y = y;
	this.xdir = xdir;
	this.ydir = ydir;
	this.draw = function() {
		this.ydir += gravity;
		this.y += this.ydir;
		if (this.xdir > 0) this.xdir -= 1;
		this.x += xdir;
		context.beginPath();
		context.arc(this.x, this.y, 2, 0, Math.PI*2, true); 
		context.stroke();
	}
}