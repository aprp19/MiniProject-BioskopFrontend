const btn = document.querySelector('.signup');
const modal_bg = document.getElementById('alert-bg');
const modal = document.getElementById('alert');

btn.addEventListener('click', function () {
    modal_bg.style.display = 'block';
    modal.style.display = 'block';

    let data = {};
    data.u_name = document.getElementById('name').value;
    data.u_username = document.getElementById('username').value;
    data.u_password = document.getElementById('password').value;
    console.log(data);

    fetch('http://localhost:5000/account/register', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
        .then(function (response) {
            if (response.status === 200) {
                $('.alert').removeClass('loading error success', false).addClass('success');
                $('.head').text('Success');
                $(modal).delay(2000).fadeOut(1000);
                $(modal_bg).delay(2000).fadeOut(1000);
                response.json().then(function (response) {
                    console.log(response);
                });
            }
            else {
                $('.alert').removeClass('loading error success', false).addClass('error');
                $(modal).delay(2000).fadeOut(1000);
                $(modal_bg).delay(2000).fadeOut(1000);
                $('.head').text('Failed');
                response.json().then(function (response) {
                    console.log(response);
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        })
});