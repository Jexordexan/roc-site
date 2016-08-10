Template.dashboard.helpers({
  checkouts: function () {
    return Checkouts.find({}, {sort: { dateRented: -1 }}).fetch();
  }
})