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
    var className = "";
    var gearState = (Router.current().params.query.id === this.code) && 'edit';
    var isQueued = (Session.get('checkoutQueue') && Session.get('checkoutQueue')[gearId]) && 'queue';
    var isRented = (this.status && !this.status.returned) && 'rented';
    return isRented || isQueued || gearState;
  }
});

Template.gearItem.events({
  'click .edit-gear': function(event) {
    event.stopPropagation();
    var gearId = this._id;
    var gearCode = this.code;
    var path = window.location.pathname;
    Session.set('activeGear', gearId);
    Router.go(path + `?id=${gearCode}&action=edit`);
  },
  'click .read-gear': function(event) {
    event.stopPropagation();
    var gearId = this._id;
    var gearCode = this.code;
    var path = window.location.pathname;
    Session.set('reading', gearId);
    Router.go(path + `?id=${gearCode}&action=info`);
  },
  'click .return-gear': function(event) {
    event.stopPropagation();
    var gearId = this._id;
    var gearCode = this.code;
    Meteor.call('returnGear', gearId, (error, result) => {
      if (error) {
        Notifications.error('Error', `Could not return ${gearCode}`);
        console.log(error)
      } else {
        Notifications.success(`${gearCode} returned`);
      }
    })
  },
  'click .queue-gear': function(event) {
    event.stopPropagation();
    if (Session.get('checkoutQueue') && Session.get('checkoutQueue')[this._id]) {
      removeFromQueue(this);
    } else {
      addToQueue(this);
    }
  },

  'click .cancel-gear': function(event) {
    event.stopPropagation();
    removeFromQueue(this)
  }
});

function removeFromQueue(gear) {
  var gearId = gear._id;
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
