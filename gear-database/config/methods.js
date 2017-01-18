Meteor.methods({
  addGear: function (gearData) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    return GearList.insert({
      code: gearData.code,
      name: gearData.name,
      description: gearData.description,
      updated: new Date(),
      created: new Date()
    });
  },
  editGear: function (data) {
    // Make sure the user is logged in before inserting a task

    var gearId = data[0];
    var gearData = data[1];
    var validData = Match.test(gearData, {
      code: String,
      name: String,
      description: String,
      condition: Number
    });

    var validCode = Schema.inventoryCodeRegEx.test(gearData.code);

    if (!validData) {
      throw new Meteor.Error("invalid-data", "Incorrect Data", "Some of the information you provided was of the incorrect type.");
    }

    if (!validCode) {
      throw new Meteor.Error("invalid-code-format", "Invalid Inventory Code", "The inventory code "+gearData.code+" does not match the pattern WM-EL-04.");
    }

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized", "Not Logged In", "You must be logged in to edit equipment.");
    }

    GearList.update(gearId, { $set: {
      code: gearData.code,
      name: gearData.name,
      description: gearData.description,
      condition: gearData.condition,
      updated: new Date()
    }});
  },
  updateRoles: function (targetUserId, roles, group) {
    var loggedInUser = Meteor.user()

    if (!loggedInUser ||
        !Roles.userIsInRole(loggedInUser, ['admin'], group)) {
      throw new Meteor.Error(403, "Access denied")
    }

    Roles.setUserRoles(targetUserId, roles, group)
  },
  checkOut: function(userId, description, queue, notes, dueInterval) {
    // require a user ID, and at least one gear item in the queue
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    if (! queue.length) {
      throw new Meteor.Error("No equipment queued.");
    }

    // set due by date to current date + interval
    var currentDate = new Date();
    var dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (dueInterval || 14));

    // create a checkout object of the userId, user's name, all the gear and codes
    var checkoutData = {
      userId: userId,
      notes: notes,
      gearRented: queue,
      dateDue: dueDate
    };

    // insert the object to the 'checkouts' collection
    var checkoutId = Checkouts.insert(checkoutData);

    // update user profile with currently rented gear

    // update gear with user ID
    _.each(queue, function(gearItem) {
      // Create rental object
      var rental = {
        rentedBy: userId,
        dateRented: currentDate,
        checkoutId: checkoutId,
        dateDue: dueDate,
        returned: false,
        dateReturned: null
      };

      GearList.update(gearItem._id, {
          $set: {status: rental}
      });

      Meteor.call('createGearRevision', gearItem._id, 'Checked out', userId);
    })
  },

  checkIn: function(checkoutId) {
    //
  },

  returnGear: function(gearId) {
    // get the gear object
    let item = GearList.findOne(gearId);
    let now = new Date();

    // check if the gear item exists before continuing
    if (!item) {
      return;
    }

    // get the current status
    let status = item.status

    // make sure the gear is still rented out
    if (status.returned) {
      return;
    }

    // set the returned prop and returnedDate on both the history and status objects
    GearList.update( gearId, {
      $set: {
        'status.returned' : true,
        'status.dateReturned' : now
      }
    });

    Meteor.call('createGearRevision', gearId, 'Checked in');
  },

  createGearRevision: function(gearId, message, userId) {
    let item = GearList.findOne(gearId);
    userId = userId || this.userId
    message = message.trim();

    History.insert({
      userId: userId,
      itemId: item._id,
      message: message,
      modified: new Date(),
      model: item
    })
  }
});
