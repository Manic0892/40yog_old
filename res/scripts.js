var stage;
var mainLayer;

var player;
var canvas;
var context;
var bullets;

window.onload = function() {
	startGame();
}

function startGame() {
	var gameState = new firstState();
	jaws.start(gameState);
}

function firstState() {
	this.setup = function () {
		canvas = $('#gamePlay')[0];
		
		bullets = new jaws.SpriteList();
		context = canvas.getContext('2d');
		
		player = new jaws.Sprite({image: 'res/plane.png', x: 10, y:100, context: context});
		jaws.on_keydown('esc', this.setup);
		jaws.preventDefaultKeys(['up', 'down', 'left', 'right', 'space']);
	}
	
	this.update = function() {
		if(jaws.pressed('left')) player.x -= 10;
		if(jaws.pressed('right')) player.x += 10;
		if(jaws.pressed('up')) player.y -= 10;
		if(jaws.pressed('down')) player.y += 10;
		if(jaws.pressed('space')) {
			bullets.push(new Bullet(player.rect().right, player.y+13));
		}
		forceInsideCanvas(player);
		bullets.removeIf(isOutsideCanvas);
	}
	
	this.draw = function() {
		jaws.clear();        // Same as: context.clearRect(0,0,jaws.width,jaws.height)
		
		player.draw();
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