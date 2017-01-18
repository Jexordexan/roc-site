var ERRORS_KEY = 'checkoutErrors';

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
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  },
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
      let val = "";
      if (m.profile) {
        val =  m.profile.firstName + " " + m.profile.lastName;
      } else {
        val =  m.emails[0].address;
      }
      return {id: m.id, value: val};
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
    var description = event.target.description.value;
    var dueInterval = parseInt(event.target.dueInterval.value);
    var notes = event.target.notes.value;

    var agreement = template.$('[name=agreement]')[0].checked;
    var queue = _.values(Session.get('checkoutQueue'));

    // Fail if the 
    var errors = {};

    if (! userId) {
      errors.user = 'You must select a member';
    }

    if (! description) {
      errors.description = 'You must provide a description';
    }

    if (! agreement) {
      errors.agreement = 'You must accept the rental agreement';
    }

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      event.stopPropagation();
      return;
    }

    Meteor.apply('checkOut', [userId, description, queue, notes, dueInterval], function(error, result) {
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