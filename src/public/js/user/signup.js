document.addEventListener('DOMContentLoaded', function () {
  const signupForm = $('form[name="signup"]')[0];
  const btnSubmit = $('#btn--submit')[0];

  btnSubmit.onclick = function (event) {
    // event.preventDefault();
    // signupForm.action = '/users/signup';
    //signupForm.method = 'POST';
    signupForm.submit();
  };
});
