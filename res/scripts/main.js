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
	assetList.push('res/img/misc/nightsky.png');
	assetList.push('res/img/misc/nighthill.png');
	assetList.push('res/img/sprites/power/health.png');
	assetList.push('res/img/sprites/power/sun.png');
	assetList.push('res/snd/gun.wav');
	assetList.push('res/snd/sun.wav');
	assetList.push('res/snd/pulse.mp3');
	for (var j in levels.blockURLs)
		assetList.push(levels.blockURLs[j]);
	jaws.assets.add(assetList);
	jaws.start(states[0]);
	
	states.push(new Level1(buildLevel(levels.lvls[0])));
	states.index = 0;
	
	//for (i in levels.lvls) {
	//	states.push(new State(buildLevel(levels.lvls[i])));
	//}
}