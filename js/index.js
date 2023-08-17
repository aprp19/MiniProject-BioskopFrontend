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
            let film_name = json['Data'][i].film_name;
            let film_poster = json['Data'][i].film_poster;
            document.getElementById("img-slider").innerHTML = arr;
            arr += `
            <img class="scale-up" id="slide-${i}" src="${film_poster}" alt="${film_name}">
            `
        }
    })