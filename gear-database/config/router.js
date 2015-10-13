function openSidebars (left, right) {
  if (left) {
    Session.set('leftSidebar', 'open');
  }
  if (right) {
    Session.set('rightSidebar', 'open');
  }
}

function closeSidebars (left, right) {
  if (left) {
    Session.set('leftSidebar', 'closed');
  }
  if (right) {
    Session.set('rightSidebar', 'closed');
  }
}


Router.configure({
  layoutTemplate: 'ApplicationLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('gear'),
      Meteor.subscribe('activities'),
      Meteor.subscribe('checkouts'),
      Meteor.subscribe('members')
    ];
  }
});

Router.route('/', function () {
  this.redirect('/inventory');
},{name: 'home'});

Router.route('/about', function () {
  this.render('about');
});

Router.route('/inventory', function () {
  this.render('inventory');
  Session.set('resultFilter', 'gear');
  closeSidebars(false, true);
  // this.layout('NoSidebarLayout');
});

Router.route('/account', function () {
  this.render('editUser');
  this.layout('NoSidebarLayout');
});

Router.route('/account/:id', function () {
  this.render('editUser', {
    data: function() {
      return Meteor.users.findOne(this.params.id);
    }
  });
});

Router.route('/inventory/info/:code', function () {
	this.render('inventory');
	this.render('sidebarInfo', {
		to: 'right',
		data: function () {
			return GearList.findOne({code: this.params.code});
		}
	})
  Session.set('activeGear', this.params.code);
  openSidebars(false, true);
}, {
	name: 'inventory.info'
});

Router.route('/inventory/edit/:code', function () {
	this.render('inventory');
	this.render('sidebarEdit', {
		to: 'right',
		data: function () {
			return GearList.findOne({code: this.params.code});
		}
	})
  Session.set('activeGear', this.params.code);
  openSidebars(false, true);
}, {
	name: 'inventory.edit'
});

Router.route('/inventory/add', function () {
  this.render('inventory');
  this.render('addGear', {
    to: 'left'
  });
}, {
  name: 'inventory.add'
});

Router.route('/inventory/search/:query', function () {
  this.render('inventory');
  this.render('addGear', {
    to: 'left'
  });
}, {
  name: 'inventory.search'
});

Router.route('/signout', {
  onBeforeAction: function () {
    Meteor.logout(function () {
        Router.go('home');
    });
    this.next();
  }
});
