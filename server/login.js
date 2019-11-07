
function submitForm() {
  var email = document.querySelector('input[name="email"]').value;
  var pass = document.querySelector('input[name="password"]').value;

  fetch('/login', {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: pass
    }),
    method: 'POST',
    mode: 'same-origin',
    credentials: 'same-origin',
    redirect: 'follow'
  }).then((res) => {
    if(!res.redirected) {
      //Parse return data
      res.json().then((data) => {
        //Display error
        console.log(data);
      });
    }else { //Take redirect if given
      window.location = res.url;
    }
  }).catch((err) => {
    console.log(err);
  });
}
