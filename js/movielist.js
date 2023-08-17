window.addEventListener('load', function () {
    setTimeout(lazyLoad, 1000);
});

function lazyLoad() {
    const card_images = document.querySelectorAll('.card-image');
    card_images.forEach(function (card_image) {
        card_images.forEach(function(card_image) {
            var image_url = card_image.getAttribute('data-image-full');
            var content_image = card_image.querySelector('img');

            // change the src of the content image to load the new high-res photo
            content_image.src = image_url;

            // listen for load event when the new photo is finished loading
            content_image.addEventListener('load', function() {
                // swap out the visible background image with the new fully downloaded photo
                card_image.style.backgroundImage = 'url(' + image_url + ')';
                // add a class to remove the blur filter to smoothly transition the image change
                card_image.className = card_image.className + ' is-loaded';
            });
        });
    });
}


async function fetchJSON(){
    const response = await fetch('http://localhost:5000/film/all');
    const json = await response.json();
    console.log(json);
    return json;
}

fetchJSON()
    .then(function (json){
        console.log('GET response: ', json);
        console.log(json['Data']);
        let arr = "";
        for (let i = 0; i < json['Data'].length; i++){
            let film_id = json['Data'][i].id_film;
            let film_name = json['Data'][i].film_name;
            let film_poster = json['Data'][i].film_poster;
            let film_desc = json['Data'][i].film_desc;
            document.getElementById("card-container").innerHTML = arr;
            arr += `
            <li class="card">
                <a class="card-image" href="#" target="_blank" style="background-image: url(${film_poster}); height: 500px" data-image-full="${film_poster}" onclick="selectMovie('${film_id}')">
                    <img src="${film_poster}" alt="${film_name}" loading="lazy"/>
                </a>
                <a class="card-description" href="#" target="_blank">
                    <h2>${film_name}</h2>
                    <p style="display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; line-clamp: 3; overflow: hidden;padding-left: 10px; padding-right: 10px">${film_desc}</p>
                </a>
                <a href="#" ><button class="signup button" onclick="selectMovie('${film_id}')">Book Now</button></a>
            </li>
            `
        }
    })
function selectMovie(film_id){
    localStorage.setItem('selectedFilmId', film_id);
    window.location.href = 'movies.html';
}
// selectMovie.addEventListener('click', function(){
//     localStorage.setItem('selectedFilmId', film_id);
//     console.log(localStorage.getItem('selectedFilmId'));
//     // window.location.href = 'index.html';
// })