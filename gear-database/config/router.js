function openSidebars (command) {
  if (command == 'left') {
    Session.set('leftSidebar', 'open');
  }
  else if (command == 'right') {
    Session.set('rightSidebar', 'open');
  }
  else if (command == 'both') {
    Session.set('leftSidebar', 'open');
    Session.set('rightSidebar', 'open');
  }
}

function closeSidebars (command) {
  if (command == 'left') {
    Session.set('leftSidebar', 'closed');
  }
  else if (command == 'right') {
    Session.set('rightSidebar', 'closed');
  }
  else if (command == 'both') {
    Session.set('leftSidebar', 'closed');
    Session.set('rightSidebar', 'closed');
  }
}

Router.configure({
  layoutTemplate: 'ApplicationLayout',
  template: 'inventory',
  waitOn: function() {
    return [
      Meteor.subscribe('gear'),
      Meteor.subscribe('activities'),
      Meteor.subscribe('checkouts'),
      Meteor.subscribe('history'),
      Meteor.subscribe('members')
    ];
  },
  onAfterAction: function() {
    closeSidebars('right');
    this.params.query.search && Session.set('searchText', this.params.query.search);
    this.params.query.mode && Session.set('activeFilter', this.params.query.mode);
    Session.set('resultFilter', this.params.query.show || 'gear');

    // Current action
    let action = this.params.query.action || 'info';

    if (action === 'add') {
      openSidebars('right');
      this.render('addGear', {
        to: 'right'
      });
      return;
    }

    // Current equipment
    let id = this.params.query.id || null;
    let gear = id && GearList.findOne({code: id});
    if (!gear) {
      return;
    }

    if (action === 'edit') {
      openSidebars('right');
      this.render('sidebarEdit', {
        to: 'right',
        data: function () {
          return gear
        }
      })
    }

    if (action === 'info') {
      openSidebars('right');
      this.render('sidebarInfo', {
        to: 'right',
        data: function () {
          return gear
        }
      })
    }
  },
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});

Router.route('/', function () {
  this.render('dashboard');
},{name: 'home'});

Router.route('/signin', function () {
  this.render('signInUp');
},{name: 'signIn'});

Router.route('/loading', function () {
  this.render('loading');
});

Router.route('/inventory', function () {
  this.render('inventory');
});

Router.route('/checkout', function () {
  Session.set('activeModal', 'checkout');
},{name: 'checkout'});

Router.route('/checkout/:id', function () {
  this.render('checkoutView', {
    data: function() {
      return Checkouts.findOne(this.params.id);
    }
  });
},{name: 'checkout.view'});

Router.route('/account', function () {
  this.render('editUser');
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
  openSidebars("right");
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
  openSidebars("right");
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
