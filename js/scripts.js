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
            console.log(json['Data'][i].film_name);
            let film_name = json['Data'][i].film_name;
            document.getElementById("demo").innerHTML = arr;
            arr += `
            <div style="font-weight: bold">${film_name}</div>
            `
        }
    })