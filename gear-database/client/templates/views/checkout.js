var dueIntervals = [
  {
    name: "Two weeks",
    value: "14"
  },
  {
    name: "One month",
    value: "30"
  }
]

Template.checkout.helpers({
  'selectedGear': function() {      
    var queue = Session.get('checkoutQueue') || {};
    queue = _.values(queue);
    return queue;
  },
  'intervals': function() {
    return dueIntervals;
  },
  'members': function() {
    return Members.find().fetch().map(function(m) {
      let name = m.profile.firstName + " " + m.profile.lastName;
      return {id: m._id, value: name};
    });
  },
  'autocomplete': (event, suggestion, datasetName) => {
    $('#renterId').val(suggestion.id);
  },
  'emailOrName': function() {
    let val = "" 
    if (this.profile) {
      val =  this.profile.firstName + " " + this.profile.lastName;
    } else {
      val =  this.emails[0].address;
    }
    return {id: this.id, value: val};
  }
});

Template.checkout.events({
  'submit #checkoutForm': function(event, template) {
    event.preventDefault();
    var userId = event.target.renterId.value;
    var dueInterval = parseInt(event.target.dueInterval.value);
    var notes = event.target.notes.value;
    var queue = _.values(Session.get('checkoutQueue'));

    Meteor.apply('checkOut', [userId, queue, notes, dueInterval], function(error, result) {
      if (error) {
        console.log("error:");
        console.log(error)
      } else {
        user = Members.findOne({_id: userId});
        Notifications.success('All set!', `${user.profile.firstName} rented ${queue.length} items `);
        Session.set('checkoutQueue', null);
      }
    });
  }
})

Template.checkout.onRendered(function() {
  Meteor.typeahead.inject(".typeahead");
})