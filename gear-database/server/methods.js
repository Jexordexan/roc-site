Meteor.methods({
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
})