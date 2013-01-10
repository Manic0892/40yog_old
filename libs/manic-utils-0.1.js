function dict() {
	//Internal Utility Functions
	this.push = function(index, value) {
		if (typeof(index) == 'string' || typeof(index) == 'bool' || typeof(index) == 'number') {
			this[this.length] = new this.node(index, value);
			this.length++;
		} else {
			for (i in index) {
				this[this.length] = new this.node(index[i],value[i]);
				this.length++;
			}
		}
	}
	
	this.pop = function() {
		var nodeToReturn = this[this.length-1];
		delete this[this.length-1];
		this.length--;
		return nodeToReturn;
	}
	
	this.lookup = function(index) {
		if (typeof(index) == 'string') {
			for (i in this) {
				if (this[i]['index'] == index) {
					return this[i]['value'];
				}
			}
		} else if (typeof(index) == 'number') {
			return this[index]['value'];
		}
		return false;
	}
	
	//Internal Entities
	this.node = function(index, value) {
		this.index = index;
		this.value = value;
	}
	
	//Constructors
	this.length = 0;
	if (arguments.length > 0) {
		indices = arguments[0];
		values = arguments[1];
		for (i in indices) {
			this[i] = new this.node(indices[i], values[i]);
			this.length++;
		}
	}
	
}