function Level1() {
	this.setup = function() {
		this.level = new level();
		this.level.world.build();
	}
	this.update = function() {
		
	}
	this.draw = function() {
		jaws.clear();
		this.level.world.spriteList.draw();
	}
}