Meteor.startup(function () {
  // 1. Set up stmp
  //   your_server would be something like 'smtp.gmail.com'
  //   and your_port would be a number like 25

  process.env.MAIL_URL = 'smtp://' + 
    encodeURIComponent('postmaster@sandbox688f3e1b6be948888f45fa952151c34c.mailgun.org') + ':' + 
    encodeURIComponent('08bc02783966bacac34af5eded5e71ef') + '@' + 
    encodeURIComponent('stmp.mailgun.org') + ':' + 587;
  
  // 2. Format the email
  //-- Set the from address
  Accounts.emailTemplates.from = 'ROC';

  //-- Application name
  Accounts.emailTemplates.siteName = 'GearDatabase';

  //-- Subject line of the email.
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Confirm Your Email Address for My_App';
  };

  //-- Email text
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return 'Thank you for registering.  Please click on the following link to verify your email address: \r\n' + url;
  };

  // 3.  Send email when account is created
  Accounts.config({
    sendVerificationEmail: true
  });
});