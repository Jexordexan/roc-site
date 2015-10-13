var dueIntervals = [
  {
    name: "Two weeks",
    value: "14"
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
    return Members.find().fetch();
  },
  'emailOrName': function() {
    if (this.profile) {
      return this.profile.firstName + " " + this.profile.lastName;
    } else {
      return this.emails[0].address;
    }
  }
})

Template.checkout.events({
  'submit #checkoutForm': function(event, template) {
    event.preventDefault();
    var userId = event.target.userId.value;
    var dueInterval = event.target.dueInterval.value;
    var notes = event.target.notes.value;
    var queue = _.values(Session.get('checkoutQueue'));

    Meteor.apply('checkOut', [userId, queue, notes, dueInterval], function(error, result) {
      if (error) {
        console.log("error:");
        console.log(error)
      } else {
        console.log("result:");
        console.log(result)
      }
    });
  }
})