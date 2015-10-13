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
    console.log(data);

    var gearId = data[0];
    var gearData = data[1];
    var validData = Match.test(gearData, {
      code: String,
      name: String,
      description: String,
      condition: Number
    });

    console.log(data);

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
  checkOut: function(userId, queue, notes, dueInterval) {
    console.log(queue)

    // require a user ID, and at least one gear item in the queue
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    // set due by date to current date + interval
    var currentDate = new Date();
    dueDate = currentDate.setTime(currentDate.getTime() + (dueInterval || (14 * 24 * 60 * 60 * 1000)));

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
          $set: {status: rental},
          $push: {history: rental}
      });
    })
  },

  checkIn: function(checkoutId) {
    //
  },

  returnGear: function(gearId) {

  },

  sendEmail: function (to, subject, text) {
    check([to, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: "Outing Club <roc@outing.org>",
      subject: subject,
      text: text
    });
  }
});
