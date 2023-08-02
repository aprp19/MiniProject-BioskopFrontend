const btn = document.querySelector('.signup');
const modal_bg = document.getElementById('alert-bg');
const modal = document.getElementById('alert');

async function alreadyLoggedIn(){
    return localStorage.getItem('token');
}

alreadyLoggedIn().then(function (token){
    if (token){
        window.location.href = 'index.html';
    }
})

btn.addEventListener('click', function () {
    modal_bg.style.display = 'block';
    modal.style.display = 'block';

    let data = {
    }
    data.u_name = document.getElementById('username').value;
    data.u_password = document.getElementById('password').value;

    fetch('http://localhost:5000/account/login', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(data.u_name + ':' + data.u_password)
        }
    })
        .then(response => {
            if (response.status === 200) {
                localStorage.setItem('token', btoa(data.username + ':' + data.password));
                console.log(localStorage.getItem('token'));
                $('.alert').removeClass('loading error success', false).addClass('success');
                $('.head').text('Success');
                $(modal).delay(2000).fadeOut(1000);
                $(modal_bg).delay(2000).fadeOut(1000);
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2900);
                return response.json();
            } else {
                $('.alert').removeClass('loading error success', false).addClass('error');
                $(modal).delay(2000).fadeOut(1000);
                $(modal_bg).delay(2000).fadeOut(1000);
                $('.head').text('Wrong Username/Password');
                return response.json();
            }
        }). then(response => {
        console.log(response);
    })
})