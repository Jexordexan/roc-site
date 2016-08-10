Template.checkoutView.helpers({
  'gear': function() {
    return GearList.find({
      _id: { $in: this.gearRented }
    });
  }
})