var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var gearFields = ['code'];

GearOptionsSearch = new SearchSource('gear', gearFields, options);


Template.queue.helpers({
  'queue': function() {
    var queue = Session.get('checkoutQueue') || {};
    queue = _.values(queue);
    return queue;
  },
  'gearOptions': function() {
    return searchResult = GearOptionsSearch.getData({
      sort: {isoScore: -1}
    });
  }
})

Template.queue.events({
  'click .cancel-gear': function(event) {
    var gearId = this._id; 
    var queue = Session.get('checkoutQueue');
    delete queue[gearId]
    var queue = Session.set('checkoutQueue', queue);
    Session.set(gearId, 'read');
  },
  'submit #quick-add': function(event) {
    event.preventDefault();
    var query = event.target.codeInput.value;
    var result = GearList.findOne({code: query});
    if (result) {
      var gearId = result._id;
      var queue = Session.get('checkoutQueue') || {};
      queue[gearId] = result;
      Session.set('checkoutQueue', queue);
      Session.set(gearId, 'queue');
      event.target.codeInput.value = "";
    }
  }
})