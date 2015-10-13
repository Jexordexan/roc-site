var ERRORS_KEY = 'gearErrors';

Template.gearItem.helpers({
  'is': function(state) {
    var gearId = this._id;
    var current = Session.get('activeGear');
    var isQueued = (Session.get('checkoutQueue') && Session.get('checkoutQueue')[gearId]) && 'queue';
    var gearState = current === this.code && 'edit';
    return gearState === state;
  },
  'isNot': function(state) {
    var gearId = this._id;
    var current = Session.get('activeGear');
    var isQueued = (Session.get('checkoutQueue') && Session.get('checkoutQueue')[gearId]) && 'queue';
    var gearState = current === this.code && 'edit';
    return gearState !== state;
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
  },
  'conditionIs': function() {
    var value = this.element.value;
    return value == this.condition && 'selected';
  }
});

Template.gearItem.events({
  'click .edit-gear': function(event, template) {
    var gearId = this._id;
    var gearCode = this.code;
    Session.set('editing', gearId);
    Router.go('inventory.edit', {code: gearCode});
  },
  'click .read-gear': function(event, template) {
    var gearId = this._id;
    var gearCode = this.code;
    Session.set('reading', gearId);
    Router.go('inventory.info', {code: gearCode});
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

function addToQueue(gear) {
  var gearId = gear._id;
  var isRented = (gear.status && !gear.status.returned);
  if (Meteor.user() && !isRented) {
    var queue = Session.get('checkoutQueue') || {};
    queue[gearId] = this;
    Session.set('checkoutQueue', queue);
    Session.set(gearId, 'queue');
  }
}
