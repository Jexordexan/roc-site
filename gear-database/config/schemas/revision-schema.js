Schema.Revision = new SimpleSchema({
  userId: {
    type: String,
    denyUpdate: true,
    regEx: SimpleSchema.RegEx.Id
  },
  itemId: {
    type: String,
    denyUpdate: true,
    regEx: SimpleSchema.RegEx.Id
  },
  message: {
    type: String,
    denyUpdate: true
  },
  modified: {
    type: Date,
    denyUpdate: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  model: {
    type: Object,
    denyUpdate: true,
    blackbox: true,
  }
});
