const btn = document.getElementById('loginBtn');

async function alreadyLoggedIn(){
    return localStorage.getItem('token');
}

alreadyLoggedIn().then(function (token){
    if (token){
        window.location.href = 'index.html';
    }
})

btn.addEventListener('click', function () {
    let data = {
        u_name: document.getElementById('username').value,
        u_password: document.getElementById('password').value
    }
    const token = btoa(data.u_name + ':' + data.u_password);
    fetch('http://localhost:5000/account/login',{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + token
        }
    })
        .then((response) => response.json())
        .then(function (response){
            console.log(response)
            if (response.status === 200){
                if (response.role === 'Admin'){
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Admin Login Successfully',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.timer) {
                            localStorage.setItem('auth', response.role)
                            localStorage.setItem('token', token)
                            window.location.href = 'Dashboard/html/dashboard-admin.html';
                        }
                    })
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Login Successfully',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.timer) {
                            localStorage.setItem('auth', response.role)
                            localStorage.setItem('token', token)
                            window.location.href = 'index.html';
                        }
                    })
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Login Failed',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        });
})