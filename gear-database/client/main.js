Meteor.startup(function () {
    Notifications.settings.animationSpeed = 250;
	_.extend(Notifications.defaultOptions, {
		timeout: 5000,
		clickBodyToClose: false,
	});
});

UI.registerHelper("UsersCollection", Meteor.users);

UI.registerHelper("currentProfile", function() {
  var user = Meteor.user();
  console.log(user);
  return user;
});