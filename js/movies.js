async function MovieDetail(){
    const response = await fetch(`http://localhost:5000/film/${localStorage.getItem('selectedFilmId')}`);
    return await response.json();
}

async function MovieSchedule(){
    const response = await fetch(`http://localhost:5000/film_schedule/${localStorage.getItem('selectedFilmId')}`);
    return await response.json();
}

function SaveSchedule(selectedSchedule){
    sessionStorage.setItem('selectedSchedule', JSON.stringify(selectedSchedule));
    console.log(sessionStorage.getItem('selectedSchedule'));
}

MovieSchedule()
    .then(function (json){
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
          <input id="radio-button" value="${id_schedule}" onclick="SaveSchedule(${id_schedule})" type="radio" name="schedule-id">
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

const chooseSeats = document.querySelector('.chooseSeats')
const selectSeats = document.getElementById('selectSeat');
const order = document.querySelector('.order');

chooseSeats.addEventListener('click', function () {
    if (sessionStorage['selectedSchedule']) {
        Promise.all([
            fetch('http://localhost:5000/seats'),
            fetch(`http://localhost:5000/ordered_seats/${sessionStorage.getItem('selectedSchedule')}`)
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

            sessionStorage.setItem('dataSeats', JSON.stringify(dataSeats));
            sessionStorage.setItem('filteredOccSeats', JSON.stringify(filteredOccSeats));
            let storageSeats = JSON.parse(sessionStorage.getItem('dataSeats'));
            let storageOccSeats = JSON.parse(sessionStorage.getItem('filteredOccSeats'));

            for(let seatNumber = 0; seatNumber < storageSeats.length; seatNumber++){
                let seatName = data[0]['Data'][seatNumber].seat_number;
                if(storageOccSeats.includes(storageSeats[seatNumber])){
                    document.getElementById('seating').innerHTML += `<div class="seat occupied" id="${storageSeats[seatNumber]}">${seatName}</div>`;
                } else {
                    document.getElementById('seating').innerHTML += `<div class="seat" id="${storageSeats[seatNumber]}">${seatName}</div>`;
                }
            }

            const seats = document.querySelectorAll(".row .seat:not(.occupied), .row .seat.occupied");
            const selectedSeatsContainer = document.querySelector(".allSeats");
            const totalAmountContainer = document.querySelector(".amount");

            let moviePrice = 45000;

            const updateUi = (selectedAmount) => {
                const allSeats = document.querySelectorAll(".row .seat.selected");

                const seatsIndex = [...allSeats].map((seat) => {

                    return [...seats].indexOf(seat) + 1;
                });

                sessionStorage.setItem("selectedIndexs", JSON.stringify(seatsIndex));

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
        selectSeats.href = '#seat-modal'
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please Choose a Schedule',
        })
        selectSeats.href = '#schedule-modal'
    }
})
order.addEventListener('click', function () {
    if (localStorage['token']) {
        const selectedSeats = JSON.parse(sessionStorage.getItem('selectedIndexs'));
        console.log(selectedSeats)
        if (selectedSeats.length > 0) {
            Swal.fire({
                title: 'Confirming Order ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirm'
            }).then((result) => {
                if (result.isConfirmed) {
                    const data = {
                        "id_schedule": parseInt(sessionStorage.getItem('selectedSchedule')),
                        "order_seat": selectedSeats
                    }

                    console.log(data)

                    fetch('http://localhost:5000/orders', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify(data)
                    })
                        .then(response => {

                            if (response.status === 200) {
                                console.log(response)
                                Swal.fire({
                                    title: 'Order Confirmed!',
                                    text: "Go to payment page to pay?",
                                    icon: 'success',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Payment Page'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        sessionStorage.clear();
                                        document.getElementById('seating').innerHTML = ''
                                        let radioButtons = document.getElementById('radio-button');
                                        radioButtons.checked = false;
                                        const allSeats = document.querySelectorAll(".row .seat.selected");
                                        allSeats.forEach((seat) => {
                                            seat.classList.remove("selected");
                                        })
                                        window.location.href = 'Dashboard/html/dashboard-user.html';
                                    } else {
                                        window.location.href = '#';
                                        sessionStorage.clear();
                                        document.getElementById('seating').innerHTML = ''
                                        let radioButtons = document.getElementById('radio-button');
                                        radioButtons.checked = false;
                                        const allSeats = document.querySelectorAll(".row .seat.selected");
                                        allSeats.forEach((seat) => {
                                            seat.classList.remove("selected");
                                        })
                                    }
                                })
                                return response.json();
                            } else {
                                console.log(response)
                                Swal.fire({
                                    title: 'Order Failed!',
                                    text: `${response.status}`,
                                    icon: 'error'
                                })
                            }
                        })
                }
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please Choose Seat!',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            })
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please Login First!',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        })
    }
})

const closeButton = document.querySelectorAll('.closeButton, .modal-back');
for (const btn of closeButton){
    btn.addEventListener('click', function () {
        sessionStorage.clear();
        document.getElementById('seating').innerHTML = ''
        let radioButtons = document.getElementById('radio-button');
        radioButtons.checked = false;
        const allSeats = document.querySelectorAll(".row .seat.selected");
        allSeats.forEach((seat) => {
            seat.classList.remove("selected");
        })
    })
}

if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    window.location.href = 'movies.html';
    sessionStorage.clear();
    document.getElementById('seating').innerHTML = ''
    let radioButtons = document.getElementById('radio-button');
    radioButtons.checked = false;
    const allSeats = document.querySelectorAll(".row .seat.selected");
    allSeats.forEach((seat) => {
        seat.classList.remove("selected");
    })
}