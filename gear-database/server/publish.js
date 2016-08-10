Meteor.publish('gear', function() {
  return GearList.find();
});

Meteor.publish('history', function() {
  return History.find();
});

Meteor.publish('members', function() {
  return Meteor.users.find();
});

Meteor.publish('activities', function() {
  return ActivityList.find();
});

Meteor.publish('checkouts', function() {
  return Checkouts.find();
});

Meteor.publish('roles', function (){ 
  return Meteor.roles.find();
})