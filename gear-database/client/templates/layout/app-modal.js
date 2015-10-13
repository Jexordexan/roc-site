Template.modal.helpers({  
  activeModal: function() {
    return Session.get('activeModal');
  },
  modalClass: function() {
    if (Session.get('activeModal')) {
      return "modal-opened";
    } else {
      return "modal-closed";
    }
  }
});

Template.modal.events({
  'click .close-modal': function() {
    Session.set('activeModal', null);
  },
  'submit form': function() {
    Session.set('activeModal', null);
  }
})