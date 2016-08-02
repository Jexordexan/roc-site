Schema.GearRental = new SimpleSchema({
  rentedBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  dateRented: {
    type: Date
  },
  checkoutId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  dateDue: {
    type: Date,
    optional: true
  },
  returned: {
    type: Boolean,
    defaultValue: false
  },
  dateReturned: {
    type: Date,
    optional: true
  }
});


Schema.Gear = new SimpleSchema({
  code: {
    type: String,
    label: "Inventory Code",
    regEx: Schema.RegEx.inventoryCode,
    index: "text",
    unique: true,
    max: 8,
    autoform: {
      autocomplete: "off",
      maxlength: 8,
      class: 'gear-code-input'
    }
  },
  name: {
    type: String,
    max: 100,
    autoform: {
      maxlength: 100,
      class: 'gear-name-input'
    }
  },
  description: {
    type: String,
    optional: true,
    max: 1000,
    autoform: {
      rows: 2,
      class: 'gear-description-input'
    }
  },
  condition: {
    type: Number,
    optional: true,
    label: "Condition",
    autoform: {
      type: "select-radio",
      class: 'gear-condition-input',
      options: function () {
        return [
          {value: 0, label: "Missing"},
          {value: 1, label: "Broken"},
          {value: 2, label: "Heavily Worn"},
          {value: 3, label: "Worn"},
          {value: 4, label: "Lightly Used"},
          {value: 5, label: "New"},
        ];
      }
    }
  },
  notes: {
    type: String,
    optional: true,
    max: 1000,
    autoform: {
      rows: 2,
      class: 'gear-description-input'
    }
  },
  activity: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden'
    },
    autoValue: function() {
      var code = this.field("code")
      if (code.isSet) {
        return code.value.split("-")[0];
      } else {
        this.unset();
      }
    }
  },
  type: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden'
    },
    autoValue: function() {
      var code = this.field("code")
      if (code.isSet) {
        return code.value.split("-")[1];
      } else {
        this.unset();
      }
    }
  },
  index: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden'
    },
    autoValue: function() {
      var code = this.field("code")
      if (code.isSet) {
        return code.value.split("-")[2];
      } else {
        this.unset();
      }
    }
  },
  status: {
    type: Schema.GearRental,
    optional: true,
    autoform: {
      type: 'hidden'
    }
  },
  history: {
    type: [Schema.GearRental],
    optional: true,
    autoform: {
      type: 'hidden'
    }
  },
  created: {
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
  },
  updated: {
    type: Date,
    denyInsert: true,
    optional: true,
    autoform: {
      type: 'hidden'
    },
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    }
  }
});