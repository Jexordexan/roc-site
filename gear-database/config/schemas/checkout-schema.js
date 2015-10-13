Schema.Checkout = new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  gearRented: {
    type: [Object],
    blackbox: true
  },
  notes: {
    type: String,
    optional: true
  },
  dateReturned: {
    type: Object,
    optional: true,
    denyInsert: true
  },
  dateDue: {
    type: Date
  },
  dateRented: {
    type: Date,
    denyUpdate: true,
    autoform: {
      type: 'hidden'
    },
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  }
});