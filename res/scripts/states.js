//function Level1() {
//	this.setup = function() {
//		this.level = new level();
//		this.level.world.build();
//	}
//	this.update = function() {
//		
//	}
//	this.draw = function() {
//		jaws.clear();
//		this.level.world.spriteList.draw();
//	}
//}

var states = [];

//states.push(menuState);

for (i in levels) {
	states.push(new State());
}