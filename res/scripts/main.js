window.onload = function() {
	var assetList = [];
	assetList.push('res/img/sprites/dummy.png');
	assetList.push('res/img/sprites/arm.png');
	assetList.push('res/img/sprites/bullet.png');
	assetList.push('res/img/misc/menu2.jpg');
	assetList.push('res/img/misc/sky1.png');
	assetList.push('res/img/misc/hill1.png');
	assetList.push('res/img/sprites/enemy1.png');
	assetList.push('res/snd/gun.wav');
	for (var j in levels.blockURLs)
		assetList.push(levels.blockURLs[j]);
	jaws.assets.add(assetList);
	jaws.start(states[0]);
	
	
	for (i in levels.lvls) {
		states.push(new State(buildLevel(levels.lvls[i])));
	}
}