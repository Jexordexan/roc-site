Template.roleTag.helpers({
  'roleTitle': function() {
    var roles = Meteor.user().roles;
    return roles.__global_roles__[0];
  }
})