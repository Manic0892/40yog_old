var stage;
var mainLayer;
var gameState;

var player;
var canvas;
var context;
var bullets;

var particles = new particleHolder();

window.onload = function() {
	startGame();
}

function startGame() {
	gameState = new firstState();
	jaws.start(gameState);
}

function firstState() {
	this.setup = function () {
		canvas = $('#gamePlay')[0];
		
		bullets = new jaws.SpriteList();
		context = canvas.getContext('2d');
		
		player = new jaws.Sprite({image: 'res/plane.png', x: 0, y:0, context: context});
		jaws.on_keydown('esc', gameState.setup);
		jaws.preventDefaultKeys(['up', 'down', 'left', 'right', 'space']);
	}
	
	this.update = function() {
		if(jaws.pressed('left')) player.x -= 10;
		if(jaws.pressed('right')) player.x += 10;
		if(jaws.pressed('up')) player.y -= 10;
		if(jaws.pressed('down')) player.y += 10;
		if(jaws.pressed('space')) {
			//bullets.push(new Bullet(player.rect().right, player.y+13));
			for (var i = 0; i < 7; i++)
				particles.p.push(new Particle(player.x, player.y, Math.floor(Math.random()*6), Math.floor(Math.random()*6)));
		}
		forceInsideCanvas(player);
		bullets.removeIf(isOutsideCanvas);
	}
	
	this.draw = function() {
		jaws.clear();        // Same as: context.clearRect(0,0,jaws.width,jaws.height)
		player.draw();
		particles.draw();
		bullets.draw();  // will call draw() on all items in the list
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
		this.x += 4;
		context.beginPath();
		context.arc(this.x, this.y, 4, 0, Math.PI*2, true); 
		context.stroke();
	}
}

function Particle(x,y,xdir, ydir) {
	this.x = x;
	this.y = y;
	this.xdir = xdir;
	this.ydir = ydir;
	this.draw = function(gravity) {
		this.ydir += gravity;
		this.y += this.ydir;
		if (this.xdir > 0) this.xdir -= 1;
		this.x += xdir;
		context.beginPath();
		context.arc(this.x, this.y, 2, 0, Math.PI*2, true); 
		context.stroke();
	}
}

function particleHolder() {
	this.p = [];
	this.gravity = 1;
	this.draw = function() {
		for (i in this.p) {
			this.p[i].draw(this.gravity);
		}
	}
}