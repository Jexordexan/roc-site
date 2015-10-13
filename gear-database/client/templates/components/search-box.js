var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var gearFields = ['code', 'name'];
var memberFields = ['profile.firstName', 'profile.lastName'];
var searchFilters = [
  {
    'id': 'all',
    'label': 'Search everything',
    'icon': 'search'
  }, {
    'id': 'gear',
    'label': 'Search inventory code',
    'icon': 'tag'
  }, {
    'id': 'members',
    'label': 'Search members',
    'icon': 'users'
  }
];

Session.setDefault('activeFilter', searchFilters[0]);

GearSearch = new SearchSource('gear', gearFields, options);

MemberSearch = new SearchSource('members', memberFields, options);

Template.searchBox.helpers({
  isLoading: function() {
    return GearSearch.getStatus().loading;
  },
  isDirty: function() {
    return Session.get("searchText") && 'dirty';
  },
  searchFilter: function() {
    return searchFilters;
  },
  activeFilter: function() {
    return Session.get('activeFilter');
  },
  activeClass: function() {
    return this.id === Session.get('activeFilter').id && 'selected';
  }
})

Template.searchBox.events({
  "click .search-filters .action-item": function(event) {
    Session.set("activeFilter", this);
  },
  "click .clear-search": function(event, template) {
    template.$('#search-input').val('').trigger('input');
  },
  "input #search-input": _.throttle(function(e) {
    if (Router.current().route.getName() !== 'inventory') {
      Router.go('inventory');
    }
    var el = e.target;
    var text = $(el).val().trim();
    Session.set("searchText", text);
    GearSearch.search(text);
    MemberSearch.search(text);
  }, 200)
});
