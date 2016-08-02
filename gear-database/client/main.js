Meteor.startup(function () {
    Notifications.settings.animationSpeed = 250;
	_.extend(Notifications.defaultOptions, {
		timeout: 5000,
		clickBodyToClose: false,
	});
});

SimpleSchema.debug = true;

Template.registerHelper("UsersCollection", Meteor.users);

Template.registerHelper("currentProfile", function() {
  return Meteor.user();
});

Template.registerHelper("username", function(userId) {
  let member = Members.findOne(userId);
  if (member.profile.lastName) {
    return member.profile.firstName + ' ' + member.profile.lastName;
  } else {
    return member.username || member.emails[0];
  }
});

Template.registerHelper('get',function(input){
  return Session.get(input);
});