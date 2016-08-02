Template.sidebarInfo.helpers({
  'rented': function() {
    if (this.status && !this.status.returned) {
      return 'Rented';
    } else {
      return 'Returned';
    }
  },
  'getActivity': function() {
    return JSON.stringify(this.status);
  }
});