async function fetchJSON(){
    const response = await fetch('http://localhost:5000/film/all');
    const json = await response.json();
    console.log(json);
    return json;
}

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

fetchJSON()
    .then(function (json){
        console.log('GET response: ', json);
        console.log(json['Data']);
        let arr = "";
        for (let i = 0; i < json['Data'].length; i++){
            let film_name = json['Data'][i].film_name;
            let film_poster = json['Data'][i].film_poster;
            document.getElementById("img-slider").innerHTML = arr;
            arr += `
            <img class="scale-up" id="slide-${i}" src="${film_poster}" alt="${film_name}">
            `
        }
    })