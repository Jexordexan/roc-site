Template.inventory.helpers({
	'gear': function() {
		var searchText = document.getElementById('search-input');
    var hasSearch = searchText && searchText.value !== "";
	  var searchResult = GearSearch.getData({
    	sort: {isoScore: -1}
    });
    return searchResult;
    return  hasSearch ? searchResult : GearList.find({}, {
      sort: {'created': -1},
      limit: 10
    });
	}, 
  'members': function() {
    var searchResult = MemberSearch.getData({
      sort: {isoScore: -1}
    });
    return searchResult;
  },
  'filteredBy': function(filter) {
    return Session.get('resultFilter') === filter;
  },
  'activeFilter': function(filter) {
    return Session.get('resultFilter') === filter && 'active';
  }
});

Template.inventory.events({
  'click .result-filter': function(event, template) {
    var filter = template.$(event.currentTarget).data('filter');
    Session.set('resultFilter', filter);
  }
})

var gearHooks = {
  onSuccess: function(formType, result) {
    console.log(this);
    if (formType == 'insert') {
      Notifications.success(this.insertDoc.code, 'Successfully added!')
    } else {
      Notifications.success(this.currentDoc.code, 'Successfully updated!')
    }
  }
}

AutoForm.hooks({
  addGearForm: gearHooks,
  editGearForm: gearHooks
})