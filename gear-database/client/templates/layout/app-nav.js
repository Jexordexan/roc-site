Template.appNavigation.helpers({});

Template.appNavigation.events({
  "click .toggle-menu": () => {
    Session.get('leftSidebar') === 'closed' ? Session.set('leftSidebar', 'open') : Session.set('leftSidebar', 'closed');
  }
});
