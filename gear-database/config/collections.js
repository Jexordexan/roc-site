ActivityList = new Mongo.Collection('activities');
ActivityList.attachSchema(Schema.Activity);
ActivityList.permit(['insert','update']).ifLoggedIn().apply();

GearList = new Mongo.Collection('gear');
GearList.attachSchema(Schema.Gear);
GearList.permit(['insert','update']).ifLoggedIn().apply();
if (Meteor.isServer) {
  GearList._ensureIndex({
      code: 1,
    }, {
      name: "GearIndex"
    }
  );
}


History = new Mongo.Collection('history');
History.attachSchema(Schema.Revision);
History.permit(['insert']).ifLoggedIn().apply();

Checkouts = new Mongo.Collection('checkouts');
Checkouts.attachSchema(Schema.Checkout);
Checkouts.permit(['insert','update']).ifLoggedIn().apply();

Members = Meteor.users;
Members.attachSchema(Schema.User);
Members.permit(['update']).ifLoggedIn().apply();
