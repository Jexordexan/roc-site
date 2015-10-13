Schema.Activity = new SimpleSchema({
  code: {
    type: String,
    max: 2,
    regEx: Schema.RegEx.activityCode
  },
  name: {
    type: String
  }
});
