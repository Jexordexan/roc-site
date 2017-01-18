Template.checkoutView.helpers({
  'gear': function() {
    return GearList.find({
      _id: { $in: _.pluck(this.gearRented, '_id') }
    });
  }
})