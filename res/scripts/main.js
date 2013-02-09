window.onload = function() {
	//states.push(menuState);
	//states.push(new Level1(buildLevel(levels.lvls[0])));
	//states.index = 0;
	
	states.push(menuState);
	
	
	var assetList = [];
	assetList.push('res/img/sprites/player/player.png');
	assetList.push('res/img/sprites/player/arm.png');
	assetList.push('res/img/sprites/enemies/bedbug.png');
	assetList.push('res/img/sprites/misc/bullet.png');
	assetList.push('res/img/misc/menu2.jpg');
	assetList.push('res/img/misc/sky1.png');
	assetList.push('res/img/misc/hill1.png');
	assetList.push('res/snd/gun.wav');
	for (var j in levels.blockURLs)
		assetList.push(levels.blockURLs[j]);
	jaws.assets.add(assetList);
	jaws.start(states[0]);
	
	states.push(new Level1(buildLevel(levels.lvls[0])));
	states.index = 0;
	
	canvas = document.getElementsByTagName('canvas')[0];
	context = canvas.getContext('2d');
	
	//for (i in levels.lvls) {
	//	states.push(new State(buildLevel(levels.lvls[i])));
	//}
}