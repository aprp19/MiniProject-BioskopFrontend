async function MovieDetail(){
    const response = await fetch(`http://localhost:5000/film/${localStorage.getItem('selectedFilmId')}`);
    return await response.json();
}

async function MovieSchedule(){
    const response = await fetch(`http://localhost:5000/film_schedule/${localStorage.getItem('selectedFilmId')}`);
    return await response.json();
}

Promise.all([
    fetch('http://localhost:5000/seats'),
    fetch(`http://localhost:5000/ordered_seats/${localStorage.getItem('selectedSchedule')}`)
]).then(function (responses) {
    // Get a JSON object from each of the responses
    return Promise.all(responses.map(function (response) {
        return response.json();
    }));
}).then(function (data) {
    // Log the data to the console
    // You would do something with both sets of data here
    const dataSeats = [];
    const dataOccSeats = [];

    for(let i = 0; i < data[0]['Data'].length; i++){
        dataSeats.push(data[0]['Data'][i].id_seat);
        dataOccSeats.push(data[1]['Data'][i]?.id_seat);
    }

    const filteredOccSeats = dataOccSeats.filter(function (filtered) {
        return filtered !== undefined;
    });

    console.log(dataSeats);
    console.log(filteredOccSeats);

    for(let seatNumber = 0; seatNumber < dataSeats.length; seatNumber++){
        let seatName = data[0]['Data'][seatNumber].seat_number;
        if(filteredOccSeats.includes(dataSeats[seatNumber])){
            document.getElementById('seating').innerHTML += `<div class="seat occupied" id="${dataSeats[seatNumber]}">${seatName}</div>`;
        } else {
            document.getElementById('seating').innerHTML += `<div class="seat" id="${dataSeats[seatNumber]}">${seatName}</div>`;
        }
    }

    const seats = document.querySelectorAll(".row .seat:not(.occupied), .row .seat.occupied");
    const occupiedSeats = document.querySelectorAll(".row .seat.occupied");
    const selectedSeatsContainer = document.querySelector(".allSeats");
    const totalAmountContainer = document.querySelector(".amount");

    let moviePrice = 45000;

    const updateUi = (selectedAmount) => {
        const allSeats = document.querySelectorAll(".row .seat.selected");

        const seatsIndex = [...allSeats].map((seat) => {

            return [...seats].indexOf(seat) + 1;
        });

        console.log(allSeats);
        console.log(seatsIndex);

        sessionStorage.setItem("selectedIndexs", JSON.stringify(seatsIndex));
        // console.log(sessionStorage.getItem("selectedIndexs"));

        if (selectedAmount) {
            moviePrice = +selectedAmount;
        }
        selectedSeatsContainer.innerText = +allSeats.length;
        totalAmountContainer.innerText = +moviePrice * allSeats.length;
    };

    const populateUi = () => {
        const selectedSeats = JSON.parse(sessionStorage.getItem("selectedIndexs"));

        if (selectedSeats !== null && selectedSeats.length > 0) {
            seats.forEach((seat, index) => {
                if (selectedSeats.indexOf(index) > -1) {
                    seat.classList.add("selected");
                }
            });
        }

        updateUi();
    };
    populateUi();

    seats.forEach((seat) => {
        seat.addEventListener("click", (e) => {
            if (seat.classList.contains("occupied")) {
                return;
            }
            seat.classList.toggle("selected");
            updateUi();
        });
    });
}).catch(function (error) {
    // if there's an error, log it
    console.log(error);
});

function SaveSchedule(selectedSchedule){
    sessionStorage.setItem('selectedSchedule', JSON.stringify(selectedSchedule));
}

MovieSchedule()
    .then(function (json){
        console.log(json);
        console.log(json['Data'].length)
        for (let i = 0; i < json['Data'].length; i++){
            let id_schedule = json['Data'][i].id_schedule;
            let schedule_date = json['Data'][i].schedule_date;
            let schedule_time = json['Data'][i].schedule_time;
            let schedule_studio = json['Data'][i].schedule_studio;
            document.getElementById("schedule").innerHTML += `
            <label for="${id_schedule}" class="method card">
        <div class="detail">
        <span>Date: ${schedule_date}</span>
        <span>Time: ${schedule_time}</span>
        <span>Studio: ${schedule_studio}</span>
        </div>

        <div class="radio-input">
          <input id="${id_schedule}" value="${id_schedule}" onclick="SaveSchedule(${id_schedule})" type="radio" name="schedule-id">
          Select
        </div>
      </label>
            `
        }
    })


MovieDetail()
    .then(function (json){
        let film_name = json['Data'].film_name;
        let film_poster = json['Data'].film_poster;
        let film_desc = json['Data'].film_desc;
        let film_duration = json['Data'].film_duration;
        let film_genre = json['Data'].category;
        let film_price = json['Data'].film_price;
        document.getElementById("movie").innerHTML +=
            `
        <div class="content">
      <img class="image" src="${film_poster}" alt="Spiderman"/>
      <div class="info">
        <div class="title">
          <a href="#">
            <h2>${film_name}</h2>
          </a>
        </div>
        <h3>
          Description
        </h3>
        <p>
          ${film_desc}
        </p>
        <div class="featured-crew">
          <h3>Details</h3>
          <ul style="list-style: none; font-size: 1.2rem">
            <li>Film Duration: ${film_duration}</li>
            <li>Genre: `+film_genre+`</li>
            <li>Price: Rp.${film_price},-</li>
          </ul>
          <div style="display: flex; justify-content: flex-end; align-items: center">
          <a href="#schedule-modal"><button class="signup button">Book Now</button></a>
          </div>
        </div>
      </div>
    </div>
        `
    })