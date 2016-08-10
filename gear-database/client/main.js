
const CONDITION_MAP = {
  0: 'Missing',
  1: 'Broken',
  2: 'Heavily worn',
  3: 'Worn',
  4: 'Lightly used',
  5: 'New'
}

Meteor.startup(function () {
    Notifications.settings.animationSpeed = 250;
	_.extend(Notifications.defaultOptions, {
		timeout: 5000,
		clickBodyToClose: false,
	});
});

SimpleSchema.debug = true;

UI.registerHelper("UsersCollection", Meteor.users);

UI.registerHelper("currentProfile", function() {
  return Meteor.user();
});

UI.registerHelper("username", function(userId) {
  let member = Members.findOne(userId);
  if (member.profile.lastName) {
    return member.profile.firstName + ' ' + member.profile.lastName;
  } else {
    return member.username || member.emails[0];
  }
});

UI.registerHelper("moment", function(date, dateFormat) {
  dateFormat = dateFormat || 'MMMM Do YYYY, h:mm a';
  if (date instanceof Date) {
    return moment(date).format(dateFormat);
  } else {
    console.error(date, 'is not a valid date object');
  }
});

UI.registerHelper('get', function(input) {
  return Session.get(input);
});

UI.registerHelper(
  'getCondition', function(condition = 0) {
    return CONDITION_MAP[condition];
});