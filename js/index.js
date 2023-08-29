
async function fetchJSON(){
    const response = await fetch('http://localhost:5000/film/all');
    return await response.json();
}

fetchJSON()
    .then(function (json){
        let arr = "";
        const jsonLength = json['Data'].length
        for (let dot = 0; dot < jsonLength; dot += 4){
            document.getElementById("slider-nav").innerHTML += `
            <a href="#slide-${dot}"></a>
            `
        }
        for (let i = 0; i < jsonLength; i++){
            let id_film = json['Data'][i].id_film
            let film_name = json['Data'][i].film_name;
            let film_poster = json['Data'][i].film_poster;
            document.getElementById("img-slider").innerHTML = arr;
            arr += `
            <img class="scale-up" id="slide-${i}" src="${film_poster}" alt="${film_name}" onclick="selectMovie(${id_film})">
            `
        }
    })

function selectMovie(id_film){
    localStorage.setItem('selectedFilmId', id_film);
    window.location.href = 'movies.html';
}

async function getSchedule(){
    const response = await fetch('http://localhost:5000/film_schedule');
    return await response.json();
}

getSchedule()
    .then(function (json){
        const carousel = json['Data'].map((card)=>{
            const date = new Date();
            let currentDay= String(date.getDate()).padStart(2, '0');
            let currentMonth = String(date.getMonth()+1).padStart(2,"0");
            let currentYear = date.getFullYear();
// we will display the date as DD-MM-YYYY
            let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;

            if (card.schedule_date >= currentDate) {
                return ` <li class="card" style="height: 750px;">
                <a class="card-image" href="#" style="background-image: url(${card.film_poster}); height: 500px" onclick="selectMovie('${card.id_film}')">
                    <img src="${card.film_poster}" alt="${card.film_name}"/>
                </a>
                <a class="card-description" href="#">
                    <h2>${card.film_name}</h2>
                    <div style="display: grid; text-align: left; padding-left: 1rem;font-size: 20px">
                        <span>Studio: ${card.schedule_studio}</span>
                        <span>Date: ${card.schedule_date}</span>
                        <span>Time: ${card.schedule_time}</span>
                    </div>
                </a>
                <a href="#" ><button class="signup button" style="margin-top: 35px" onclick="selectMovie('${card.id_film}')">Book Now</button></a>
            </li>`
            }
        })
        document.getElementById("card-container").innerHTML = carousel.join("");
    })

async function searchDate(){
    const searchValue = document.getElementById("searchDate").value;
    const response = await fetch('http://localhost:5000/film_schedule/search?date=' + searchValue);
    const json =  await response.json();

    const cards = json['Data'].map((card)=>{
        return ` <li class="card"    style="height: 750px;">
                <a class="card-image" href="#" style="background-image: url(${card.film_poster}); height: 500px" onclick="selectMovie('${card.id_film}')">
                    <img src="${card.film_poster}" alt="${card.film_name}"/>
                </a>
                <a class="card-description" href="#">
                    <h2>${card.film_name}</h2>
                    <div style="display: grid; text-align: left; padding-left: 1rem;font-size: 20px">
                        <span>Studio: ${card.schedule_studio}</span>
                        <span>Date: ${card.schedule_date}</span>
                        <span>Time: ${card.schedule_time}</span>
                    </div>
                </a>
                <a href="#" ><button class="signup button" style="margin-top: 35px" onclick="selectMovie('${card.id_film}')">Book Now</button></a>
            </li>`
    });
    document.getElementById("card-container").innerHTML = cards.join("");
}