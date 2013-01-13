window.onload = function() {
	var stage = new Kinetic.Stage({
		container: "canvas",
		width: window.innerWidth-50,
		height: window.innerHeight-50
	});
	stage.setDraggable(true);
	
	var draggableLayer = new Kinetic.Layer();
	//draggableLayer.setDraggable("draggable");
	
	//a large transparent background to make everything draggable
	//var background = new Kinetic.Rect({
	//	x: -1000,
	//	y: -1000,
	//	width: 2000,
	//	height: 2000,
	//	fill: "#000000",
	//	opacity: 0
	//});
	
	//draggableLayer.add(background);
	
	
	//don't mind this, just to create fake elements
	//var addCircle = function(x, y, r){
	//	draggableLayer.add(new Kinetic.Circle({
	//		x: x*700,
	//		y: y*700,
	//		radius: r*20,
	//		fill: "rgb("+ parseInt(255*r) +",0,0)"
	//	})
	//	);
	//}
	var mainCircle = new Kinetic.Circle({
		x: 500,
		y: 500,
		radius: 60,
		fill: "rgb("+ parseInt(255*3) +",0,0)"
	});
	mainCircle.setDraggable("draggable");
	mainCircle.on('mouseover', function() {
		stage.setDraggable(false);
	});
	mainCircle.on('mouseout', function() {
		stage.setDraggable(true);
	});
	draggableLayer.add(mainCircle);
	
	//var circles = 300
	//while (circles) {
	//	addCircle(Math.random(),Math.random(), Math.random())
	//	circles--;
	//}
	
	var zoom = function(e) {
		var zoomAmount = e.wheelDeltaY*0.001;
		if (draggableLayer.getScale().x+zoomAmount > 0)
		draggableLayer.setScale(draggableLayer.getScale().x+zoomAmount)
		draggableLayer.draw();
		console.log(draggableLayer.getX(), draggableLayer.getY());
		console.log(mainCircle.getX(), mainCircle.getY());
	}
	
	document.addEventListener("mousewheel", zoom, false)
	
	stage.add(draggableLayer)
}