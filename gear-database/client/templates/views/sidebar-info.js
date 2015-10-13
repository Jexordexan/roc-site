Template.sidebarInfo.helpers({
  'getActivity': function() {
    var activityCode = this.activity;
    var activityName = ActivityList.findOne({code: activityCode});
    return activityName.name;
  }
});