async function fetchJSON(){
    const response = await fetch('http://localhost:5000/film/all');
    return await response.json();
}

fetchJSON()
    .then(function (json){
        const carousel = json['Data'].map((card)=>{
            return ` <li class="card">
                <a class="card-image" href="#" style="background-image: url(${card.film_poster}); height: 500px" onclick="selectMovie('${card.film_id}')">
                    <img src="${card.film_poster}" alt="${card.film_name}" loading="lazy"/>
                </a>
                <a class="card-description" href="#">
                    <h2>${card.film_name}</h2>
                    <p style="display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; line-clamp: 3; overflow: hidden;padding-left: 10px; padding-right: 10px">${card.film_desc}</p>
                </a>
                <a href="#" ><button class="signup button" onclick="selectMovie('${card.id_film}')">Book Now</button></a>
            </li>`
        })
        document.getElementById("card-container").innerHTML = carousel.join("");
    })

async function SearchMenu(){
    const searchValue = document.getElementById("search").value;
    const response = await fetch('http://localhost:5000/film/search?film_name=' + searchValue);
    const json =  await response.json();

    const cards = json['Data'].map((card)=>{
        return ` <li class="card">
                <a class="card-image" href="#" target="_blank" style="background-image: url(${card.film_poster}); height: 500px" data-image-full="${card.film_poster}" onclick="selectMovie('${card.film_id}')">
                    <img src="${card.film_poster}" alt="${card.film_name}" loading="lazy"/>
                </a>
                <a class="card-description" href="#" target="_blank">
                    <h2>${card.film_name}</h2>
                    <p style="display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; line-clamp: 3; overflow: hidden;padding-left: 10px; padding-right: 10px">${card.film_desc}</p>
                </a>
                <a href="#" ><button class="signup button" onclick="selectMovie('${card.id_film}')">Book Now</button></a>
            </li>`
    });
    document.getElementById("card-container").innerHTML = cards.join("");
}

function selectMovie(film_id){
    localStorage.setItem('selectedFilmId', film_id);
    window.location.href = 'movies.html';
}