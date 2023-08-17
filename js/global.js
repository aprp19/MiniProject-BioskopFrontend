async function checkUser(){
    return localStorage.getItem('token');
}

const btn_logout = document.getElementById('login-button');
btn_logout.addEventListener('click', function(){
    localStorage.removeItem('token');
})

checkUser()
    .then(function (token){
        let login = document.getElementById('login-button');
        if (token) {
            login.innerHTML = 'Logout';
            login.setAttribute('href', 'index.html');
        } else {
            login.innerHTML = 'Login';
            login.setAttribute('href', 'login.html');
        }
    })