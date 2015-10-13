Template.starRating.helpers({
	'showStars': function() {
		if (parseInt(this.rating)) {
			return true;
		} else {
			this.rating = "MISSING";
			return false;
		}
	},
	'stars': function() {
		var stars = [];
		var rating = parseInt(this.rating);
		for (var i = 0; i < this.max; i++) {
			var starClass = i < rating ? "filled" : "empty";
			stars.push({class: starClass});
		};
		return stars;
	}, 
	'conditionClass': function() {
		if (this.rating <= (this.max * 0.2)) {
			return 'bad';
		} else if (this.rating <= (this.max * 0.8)) {
			return 'good';
		} else {
			return 'great';
		}
	}
})