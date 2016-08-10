Template.sidebarInfo.helpers({
  'rented': function() {
    if (this.status && !this.status.returned) {
      return 'Checked out';
    } else {
      return 'Checked in';
    }
  },
  'history' : function() {
    return History.find({ itemId: this._id }, {sort: {modified: -1}}).fetch();
  },
  'getActivity': function() {
    return JSON.stringify(this.status);
  }
});

Template.sidebarInfo.events({
  'click .edit-gear': function(event, template) {
    var gearId = this._id;
    var gearCode = this.code;
    Session.set('editing', gearId);
    Router.go('inventory', {}, {query: `id=${gearCode}&action=edit`});
  }
})