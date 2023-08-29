async function checkUser(){
    return localStorage.getItem('token');
}

checkUser()
    .then(function (token){
        let login = document.getElementById('login-button');
        const auth = localStorage.getItem('auth');
        if (token) {
            if (auth === 'Admin'){
                login.innerHTML = 'Dashboard';
                login.setAttribute('href', 'Dashboard/html/dashboard-admin.html');
            } else {
                login.innerHTML = 'Dashboard';
                login.setAttribute('href', 'Dashboard/html/dashboard-user.html');
            }
        } else {
            login.innerHTML = 'Login';
            login.setAttribute('href', 'login.html');
        }
    })