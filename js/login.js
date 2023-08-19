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
    const token = btoa(data.u_name + ':' + data.u_password);
    localStorage.setItem('token', token);

    fetch('http://localhost:5000/account/login', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + token
        }
    })
        .then(response => {
            if (response.status === 200) {
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
                localStorage.removeItem('token');
                return response.json();
            }
        }). then(response => {
        console.log(response);
    })
})