Template.ApplicationLayout.helpers({
  activeModalClass: function() {
    return Session.get('activeModal') && 'active-modal';
  },
  'sidebarClass': function(id) {
    return Session.get(id);
  }
})

Template.ApplicationLayout.events({
  'input input.gear-code-input': function(event) {
    var val = event.target.value.replace(/\W/g, '').toUpperCase();
    var newVal = '';
    while (val.length > 2) {
      newVal += val.substr(0, 2) + '-';
      val = val.substr(2);
    }
    newVal += val;
    event.target.value = newVal;
  },

  'input input.phone-number-input': function(event) {
    var val = event.target.value.replace(/\D/g, '');
    var newVal = val.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    event.target.value = newVal;
  },

  'click button.modal-trigger': function(event, template) {
    var name = template.$(event.currentTarget).data('modal-template');
    Session.set('activeModal', name);
  },

  'mousedown .resize-width-handle': function(event) {
    var el = $(event.target);
    var p = el.parent();
    var startW = p.width();
    var startX = event.pageX;
    var onRight = el.hasClass("right-side");
    var onLeft = el.hasClass("left-side");

    function adjustWidth(event) {
      event.preventDefault();
      if (onRight) {
        p.width(startW + (event.pageX - startX));
      } else {
        p.width(startW - (event.pageX - startX));
      }
    }

    $(window).mousemove(adjustWidth);
    $(window).one('mouseup', function() {
      $(window).off('mousemove');
    });
  },

  'click .close-sidebar': function(event, template) {
    var sidebarId = template.$(event.currentTarget).data('sidebar-id');
    Session.set(sidebarId, 'closed')
  },

  'click .open-sidebar': function(event, template) {
    var sidebarId = template.$(event.currentTarget).data('sidebar-id');
    Session.set(sidebarId, 'open')
  }
});

//var recognition = new webkitSpeechRecognition();
//recognition.continuous = true;
//recognition.interimResults = true;
//recognition.onresult = function(event) {
//  console.log(event)
//}
//recognition.start();
