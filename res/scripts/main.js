window.onload = function() {
	var assetList = [];
	for (var i in levels) {
		for (var j in levels[i].blockURLs)
			assetList.push(levels[i].blockURLs[j]);
	}
	jaws.assets.add(assetList);
	jaws.start(states[0]);
}