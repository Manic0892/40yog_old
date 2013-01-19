var states = [];

var menuState = new function() {
	this.setup = function() {
		this.items = ['Start', 'Settings', 'Levels'];
		for (i in this.items) {
			var newText = new Kinetic.Text({
				x: 100,
				y: 100*i+20*i+10,
				text: this.items[i],
				fontSize: 100,
				fontFamily: 'Calibri',
				fill: '#555',
				width: 380,
				align: 'center'
			});
			var newRect = new Kinetic.Rect({
				x: 100,
				y: 100*i+20*i+10,
				 stroke: '#555',
				strokeWidth: 5,
				fill: '#ddd',
				width: newText.getWidth(),
				height: newText.getHeight(),
				shadowColor: 'black',
				shadowBlur: 10,
				shadowOffset: [10, 10],
				shadowOpacity: 0.2,
				cornerRadius: 10
			});
			newText.choice = this.items[i];
			newText.on('click', function() {
				if (this.choice == 'Start') {
					cleanupLayer();
					states.index++;
					jaws.switchGameState(states[states.index]);
			       }
			})
			layer.add(newRect);
			layer.add(newText);
		}
	}
	this.update = function() {
	}
	this.draw = function() {
		jaws.clear();
		stage.draw();
	}
}


function setupStates() {
	states.push(menuState);
	states.index = 0;
}