async function checkUser(){
    return localStorage.getItem('token');
}

checkUser()
    .then(function (token){
        let login = document.getElementById('login-button');
        if (token) {
            login.innerHTML = 'Dashboard';
            login.setAttribute('href', 'Dashboard/html/dashboard.html');
        } else {
            login.innerHTML = 'Login';
            login.setAttribute('href', 'login.html');
        }
    })