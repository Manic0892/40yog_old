window.onload = function() {
	jaws.assets.add(['res/img/block.png', 'res/img/bullet.png', 'res/img/droid.png', 'res/img/droidarm.png']);
	var newLevel =  new level({cellSize:22});
	console.log(newLevel.events);
	console.log(newLevel.cellSize);
	//jaws.start(menuState);
}