window.onload = function() {
	var level1 = new level();
	level1.world.height = 1024;
	level1.world.width = 3200;
	level1.world.createBlocks('./res/img/blocks.png', [{x:0, y:992}, {x:32, y:992}, {x:64, y:992}, {x:96, y:992}]);
}