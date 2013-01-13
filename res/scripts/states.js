var states = [];

var menuState = new function() {
	this.setup = function() {
		this.items = ['Start', 'Settings', 'Levels'];
		this.selected = 0;
		this.fontsize = 150;
		this.initoffset = 150;
		this.spacing = this.fontsize;
	}
	this.update = function() {
		//var mousex = jaws.mouse_x;
		var mousey = jaws.mouse_y;
		var elements = this.items.length;
		var selection = Math.floor(mousey/(this.spacing/*+(this.initoffset-this.fontsize)*/));
		//console.log(Math.ceil(selection));
		if (selection < 0)
			selection = 0;
		else if (selection > this.items.length-1)
			selection = this.items.length-1;
		this.selected = selection;
		if (jaws.pressed('left_mouse_button')) {
			if (this.selected == 0)
				jaws.switchGameState(states[states.index++]);
		}
	}
	this.draw = function() {
		jaws.clear();
		for(var i=0; this.items[i]; i++) {
			jaws.context.font = 'bold ' + this.fontsize + 'pt impact';
			jaws.context.lineWidth = 10;
			jaws.context.fillStyle =  (i == this.selected) ? "Red" : "Black";
			jaws.context.strokeStyle =  "rgba(200,200,200,0.0)";
			jaws.context.fillText(this.items[i], 30, this.initoffset + i * this.spacing);
		}
	}
}



states.push(menuState);
states.index = 0;

for (i in levels) {
	states.push(new State(levels[i]));
}