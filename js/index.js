
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
        const date = new Date();
        const carousel = json['Data'].map((card)=>{
            let getTime = JSON.parse(card.schedule_time)
            let getDate = new Date(card.schedule_date)
            getDate.setHours(getTime.slice(0,2), getTime.slice(3,5))
            // card.schedule_date >= currentDate
            if (getDate >= date){
                return ` <li class="card" style="height: 750px;">
                <a class="card-image" href="#" style="background-image: url(${card.film_poster}); height: 500px" onclick="selectMovie('${card.id_film}')">
                    <img src="${card.film_poster}" alt="${card.film_name}"/>
                </a>
                <a class="card-description" href="#">
                    <h2>${card.film_name}</h2>
                    <div style="display: grid; text-align: left; padding-left: 1rem;font-size: 20px">
                        <span>Studio: ${card.schedule_studio}</span>
                        <span>Date: ${card.schedule_date.slice(0,16)}</span>
                        <span>Time: ${JSON.parse(card.schedule_time)}</span>
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
    console.log(json.Error)
    if (json.Error){
        return document.getElementById("card-container").innerHTML = ` <li class="card"    style="height: 250px">
                <a class="card-description" href="#">
                    <h2 style="padding-top: 30%">Not Found</h2>
                </a>
            </li>`
    }
    const cards = json['Data'].map((card)=>{
        return ` <li class="card"    style="height: 750px;">
                <a class="card-image" href="#" style="background-image: url(${card.film_poster}); height: 500px" onclick="selectMovie('${card.id_film}')">
                    <img src="${card.film_poster}" alt="${card.film_name}"/>
                </a>
                <a class="card-description" href="#">
                    <h2>${card.film_name}</h2>
                    <div style="display: grid; text-align: left; padding-left: 1rem;font-size: 20px">
                        <span>Studio: ${card.schedule_studio}</span>
                        <span>Date: ${card.schedule_date.slice(0,16)}</span>
                        <span>Time: ${JSON.parse(card.schedule_time)}</span>
                    </div>
                </a>
                <a href="#" ><button class="signup button" style="margin-top: 35px" onclick="selectMovie('${card.id_film}')">Book Now</button></a>
            </li>`

    });
    document.getElementById("card-container").innerHTML = cards.join("");
}

async function SearchMenu(){
    const searchValue = document.getElementById("search").value;
    const response = await fetch('http://localhost:5000/film_schedule/search?film_name=' + searchValue);
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
                        <span>Date: ${card.schedule_date.slice(0,16)}</span>
                        <span>Time: ${JSON.parse(card.schedule_time)}</span>
                    </div>
                </a>
                <a href="#" ><button class="signup button" style="margin-top: 35px" onclick="selectMovie('${card.id_film}')">Book Now</button></a>
            </li>`
    });
    document.getElementById("card-container").innerHTML = cards.join("");
}