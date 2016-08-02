var ERRORS_KEY = 'gearErrors';

// A gear item is an interactive UI component for any peice of equipment in the database

Template.gearItem.helpers({
  'is': function(state) {
    var activeGear = Session.get('activeGear');

    switch (state) {
      case 'queue':
        return Session.get('checkoutQueue') && Session.get('checkoutQueue')[this._id];
        break;
      case 'active':
        return activeGear === this.code;
        break;
      case 'rented':
        return this.status && !this.status.returned;
        break;
      default: 
        return false;
    }
  },
  'getState': function() {
    var gearId = this._id;
    var current = Session.get('activeGear');
    var gearState = (current === this.code) && 'edit';
    var isQueued = (Session.get('checkoutQueue') && Session.get('checkoutQueue')[gearId]) && 'queue';
    var isRented = (this.status && !this.status.returned) && 'rented';
    return isRented || isQueued || gearState;
  },
  'errorFor': function(key) {
      return Session.get(ERRORS_KEY) && Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.gearItem.events({
  'click .edit-gear': function(event, template) {
    var gearId = this._id;
    var gearCode = this.code;
    Session.set('editing', gearId);
    Router.go('inventory', {}, {query: `id=${gearCode}&action=edit`});
  },
  'click .read-gear': function(event, template) {
    var gearId = this._id;
    var gearCode = this.code;
    Session.set('reading', gearId);
    Router.go('inventory', {}, {query: `id=${gearCode}&action=info`});
  },
  'click .queue-gear': function(event) {
    addToQueue(this);
  },

  'click .cancel-gear': function(event) {
    var gearId = this._id;
    var queue = Session.get('checkoutQueue');
    delete queue[gearId];
    Session.set('checkoutQueue', queue);
    Session.set(gearId, 'deafult');

  },
  'submit .edit-gear-form, reset .edit-gear-form': function(event) {
    var _gearId = this.doc._id;
    Session.set(_gearId, 'default');
  }
});

function removeFromQueue(gear) {
  var gearId = this._id;
    var queue = Session.get('checkoutQueue');
    delete queue[gearId];
    Session.set('checkoutQueue', queue);
    Session.set(gearId, 'deafult');
}

function addToQueue(gear) {
  var gearId = gear._id;
  var isRented = (gear.status && !gear.status.returned);
  if (Meteor.user() && !isRented) {
    var queue = Session.get('checkoutQueue') || {};
    queue[gearId] = gear;
    Session.set('checkoutQueue', queue);
    Session.set(gearId, 'queue');
  }
}
