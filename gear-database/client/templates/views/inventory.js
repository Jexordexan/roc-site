Template.inventory.helpers({
	'gear': function() {
    let searchOptions = {
      sort: {'updated': -1},
      limit: Session.get('resultLimit') || 20
    }
		let searchText = Session.get("searchText");
    GearSearch.search(searchText, searchOptions);

	  let searchResult = GearSearch.getData();
    return  searchText ? searchResult : GearList.find({}, searchOptions);
	}, 
  'members': function() {
    let searchOptions = {
      sort: {'updated': -1},
      limit: Session.get('resultLimit') || 20
    }
    let searchText = Session.get("searchText");
    MemberSearch.search(searchText);

    let searchResult = MemberSearch.getData();
    return searchText ? searchResult : Members.find({}, {
      sort: {'created': -1},
      limit: 10
    });;
  },
  'filteredBy': filter => {
    return Session.get('resultFilter') === filter;
  },
  'activeFilter': filter => {
    return Session.get('resultFilter') === filter && 'active';
  },
  'isLimit': number => {
    return Session.get('resultLimit') === +number && 'active';
  }
});

Template.inventory.events({
  'click .result-filter': function(event, template) {
    let el = $(event.currentTarget);
    if (el.data('limit')) {
      Session.set('resultLimit', +el.data('limit'));
    }
  }
})

var gearHooks = {
  onSuccess: function(formType, result) {
    if (formType == 'insert') {
      Notifications.success(this.insertDoc.code, 'Successfully added!');
      Meteor.call('createGearRevision', this.insertDoc._id, 'Added to inventory');
    } else {
      Notifications.success(this.currentDoc.code, 'Successfully updated!');
      Meteor.call('createGearRevision', this.currentDoc._id, 'Updated');
    }
  }
}

AutoForm.hooks({
  addGearForm: gearHooks,
  editGearForm: gearHooks
})