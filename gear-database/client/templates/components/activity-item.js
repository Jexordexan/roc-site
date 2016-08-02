Template.activityItem.helpers({
  'getRenter': function() {
    let member = Members.findOne(this.rentedBy);
    return member.profile.firstName + ' ' + member.profile.lastName;
  }
})