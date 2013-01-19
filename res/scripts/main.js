window.onload = function() {
	var assetList = [];
	assetList.push('res/img/sprites/dummy.png');
	assetList.push('res/img/sprites/arm.png');
	assetList.push('res/img/misc/menu2.jpg');
	for (var j in levels.blockURLs)
		assetList.push(levels.blockURLs[j]);
	jaws.assets.add(assetList);
	jaws.start(states[0]);
	
	
	for (i in levels.lvls) {
		states.push(new State(buildLevel(levels.lvls[i])));
	}
}