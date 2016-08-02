Template.roleTag.helpers({
  'roleTitle': function() {
    user = this.user || Meteor.user();
    var roles = user.roles;
    return roles.__global_roles__[0];
  }
})