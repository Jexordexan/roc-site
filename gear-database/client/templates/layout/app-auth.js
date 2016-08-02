var ERRORS = {}

ERRORS.SIGNIN = 'signinErrors';
ERRORS.JOIN = 'joinErrors';

Template.signIn.onCreated(function() {
  Session.set(ERRORS.SIGNIN, {});
});

Template.signIn.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS.SIGNINÎ));
  },
  errorClass: function(key) {
    return Session.get(ERRORS.SIGNIN)[key] && 'error';
  }
});

Template.signIn.events({
  'submit': function(event, template) {
    event.preventDefault();
    
    var email = template.$('[name=email]').val();
    var password = template.$('[name=password]').val();
    
    var errors = {};

    if (! email) {
      errors.email = 'Email is required';
    }

    if (! password) {
      errors.password = 'Password is required';
    }
    
    Session.set(ERRORS.SIGNIN, errors);
    if (_.keys(errors).length) {
      return;
    }
    
    Meteor.loginWithPassword(email, password, function(error) {
      if (error) {
        return Session.set(ERRORS.SIGNIN, {'none': error.reason});
      }
      
      Router.go('home');
      Notifications.success('Successfully signed in!');
    });
  }
});


Template.join.onCreated(function() {
  Session.set(ERRORS.JOIN, {});
});

Template.join.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS.JOIN));
  },
  errorClass: function(key) {
    return Session.get(ERRORS.JOIN)[key] && 'error';
  }
});

Template.join.events({
  'submit': function(event, template) {
    event.preventDefault();
    var email = template.$('[name=email]').val();
    var password = template.$('[name=password]').val();

    var errors = {};

    if (! email) {
      errors.email = 'Email required';
    }

    if (! password) {
      errors.password = 'Password required';
    }

    Session.set(ERRORS.JOIN, errors);
    if (_.keys(errors).length) {
      return;
    }

    Accounts.createUser({
      email: email,
      password: password
    }, function(error) {
      if (error) {
        return Session.set(ERRORS.JOIN, {'none': error.reason});
      }
      Router.go('home');
      Notifications.success('Account successfuly created!');
    });
  }
});
