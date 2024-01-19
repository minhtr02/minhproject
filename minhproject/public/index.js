'use strict';

const button_login = document.getElementById('button_login');
const button_register = document.getElementById('button_register');
const button_logout = document.getElementById('button_logout');
const log_out = document.getElementById('log-out');
const app = document.getElementById('app')
const sc = document.getElementById('sc')
if(log_out) {
  log_out.onclick = function() {

  fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => res.json())
        .then(a => {
          window.location.href = '/'
        }).catch((error) => {
          console.log(error);
        });

}
}



function getCk(cookie) {
  let name = cookie + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

if (getCk('student_name')) {
  if(app) {
    app.style.display = 'block';
  }
  if (sc) {
    sc.style.display = 'none';
  }
  
  
  button_logout.style.display = 'block';
  button_register.style.display = 'none';
  button_login.style.display = 'none';
}
else {
  if (sc) {
    sc.style.display = 'flex';
  }
  if (app) {
     app.style.display = 'none';
  }
 
  button_register.style.display = 'block';
  button_login.style.display = 'block';
  button_logout.style.display = 'none';
}

let btn_enroll = document.getElementsByClassName('btn-enroll')

if (btn_enroll) {
  btn_enroll.onclick = function (e) {
    console.log(e)
  }
}
