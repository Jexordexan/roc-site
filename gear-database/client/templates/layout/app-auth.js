var SIGNIN_ERRORS_KEY = 'signinErrors';
var JOIN_ERRORS_KEY = 'joinErrors';

Template.signIn.onCreated(function() {
  Session.set(SIGNIN_ERRORS_KEY, {});
});

Template.signIn.helpers({
  errorMessages: function() {
    return _.values(Session.get(SIGNIN_ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(SIGNIN_ERRORS_KEY)[key] && 'error';
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
    
    Session.set(SIGNIN_ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }
    
    Meteor.loginWithPassword(email, password, function(error) {
      if (error) {
        return Session.set(SIGNIN_ERRORS_KEY, {'none': error.reason});
      }
      
      Router.go('home');
      Notifications.success('Successfully signed in!');
    });
  }
});


Template.join.onCreated(function() {
  Session.set(JOIN_ERRORS_KEY, {});
});

Template.join.helpers({
  errorMessages: function() {
    return _.values(Session.get(JOIN_ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(JOIN_ERRORS_KEY)[key] && 'error';
  }
});

Template.join.events({
  'submit': function(event, template) {
    event.preventDefault();
    var email = template.$('[name=email]').val();
    var password = template.$('[name=password]').val();
    var confirm = template.$('[name=confirm]').val();

    var errors = {};

    if (! email) {
      errors.email = 'Email required';
    }

    if (! password) {
      errors.password = 'Password required';
    }

    if (confirm !== password) {
      errors.confirm = 'Please confirm your password';
    }

    Session.set(JOIN_ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }

    Accounts.createUser({
      email: email,
      password: password
    }, function(error) {
      if (error) {
        return Session.set(JOIN_ERRORS_KEY, {'none': error.reason});
      }
      Router.go('home');
      Notifications.success('Account successfuly created!');
    });
  }
});
