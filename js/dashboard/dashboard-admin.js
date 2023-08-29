async function getAllOrders(){
    const response = await fetch('http://localhost:5000/orders', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + localStorage.getItem('token')
        }
    });
    return await response.json();
}

async function getAllUsers(){
    const response = await fetch('http://localhost:5000/account/alluser', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + localStorage.getItem('token')
        }
    })
    return await response.json();
}

async function getAllFilm(){
    const response = await fetch('http://localhost:5000/film/all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json()
}

async function getAllSchedule(){
    const response = await fetch('http://localhost:5000/film_schedule', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json()
}

async function getReporting(){
    const response = await fetch('http://localhost:5000/film/report', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + localStorage.getItem('token')
        }
    })
    return await response.json()
}

async function getCategory(){
    const response = await fetch('http://localhost:5000/category/all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json()
}

getAllUsers()
    .then(function (json){
        const userList = json['Data'].map((user) => {
            return `<tr>
                      <td>${user.id_user}</td>
                      <td>${user.u_name}</td>
                      <td>${user.u_username}</td>
                      <td>${user.u_role}</td>
                      <td>${user.wallet}</td>
                      <td>
                        <button type="button" class="btn btn-outline-primary" onclick="topUp(${user.id_user},10000)">Top Up</button>
                        <button type="button" class="btn btn-outline-primary" onclick="editUser(${user.id_user})">Edit</button>
                      </td>
                    </tr>`
        });
        document.getElementById('user-table').innerHTML = userList.join("");
    })

function editUser(id_user) {
    const {value: formValues} = Swal.fire({
        title: 'Edit User',
        html:
            '<label for="id_user" class="form-label">User ID</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-id_user"\n' +
            '                          value="' + id_user + '"\n' +
            '                          readonly' +
            '                        />' +
            '<label for="name" class="form-label">Name</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-name"\n' +
            '                        />' +
            '<label for="username" class="form-label">Username</label>\n' +
            '                        <input\n' +
            '                          type="email"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-username"\n' +
            '                        />' +
            '<label for="password" class="form-label">Password</label>\n' +
            '                        <input\n' +
            '                          type="password"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-password"\n' +
            '                        />' +
            '<label for="role" class="form-label">Role</label>\n' +
            '                        <select class="form-select" id="swal-role" aria-label="Default select example">\n' +
            '                          <option selected value="">Select Role</option>\n' +
            '                          <option value="Admin">Admin</option>\n' +
            '                          <option value="User">User</option>\n' +
            '                        </select>',
        focusConfirm: false,
        confirmButtonText: 'Save Changes',
        preConfirm: () => {
            const id_user = Swal.getPopup().querySelector('#swal-id_user').value
            const name = Swal.getPopup().querySelector('#swal-name').value
            const username = Swal.getPopup().querySelector('#swal-username').value
            const password = Swal.getPopup().querySelector('#swal-password').value
            const role = Swal.getPopup().querySelector('#swal-role').value
            if (!name || !username || !password || !role) {
                Swal.showValidationMessage(`Please fill all form`)
            }
            return {
                id_user: document.querySelector('#swal-id_user').value,
                u_name: name,
                u_username: username,
                u_password: password,
                u_role: role
            }
        }
    }).then((result) => {
        if (result.isConfirmed){
            const data = {
                u_name : result.value.u_name,
                u_username : result.value.u_username,
                u_password : result.value.u_password,
                u_role : result.value.u_role,
            }
            fetch('http://localhost:5000/account/' + result.value.id_user, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
                .then(function (response){
                    if (response.status === 200){
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Update Successfully',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        }).then((result) => {
                            if (result.dismiss === Swal.DismissReason.timer) {
                                window.location.reload();
                            }
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Update Failed',
                            timer: 2000,
                            timerProgressBar: true
                        })
                    }
                })
        }
    })
}

getAllOrders()
    .then(function (json){
        const orderList = json['Data'].map((order)=>{
            if (order.order_status === 'Not Paid'){
                return `<tr>
                      <td>${order.order_username}</td>
                      <td><i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>${order.film_name}</strong></td>
                      <td>${order.order_date}, ${order.order_time}</td>
                      <td>${order.order_studio}</td>
                      <td>${order.order_seat}</td>
                      <td><span class="badge bg-label-warning me-1">${order.order_status}</span></td>
                      <td>
<!--                        <button type="button" class="btn btn-outline-primary" onclick="payOrder(${order.id_order})">Pay</button>-->
<!--                        <button type="button" class="btn btn-outline-danger" onclick="cancelOrder(${order.id_order})">Cancel</button>-->
                      </td>
                    </tr>`
            } else if (order.order_status === 'Paid'){
                return `<tr>
                      <td>${order.order_username}</td>
                      <td><i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>${order.film_name}</strong></td>
                      <td>${order.order_date}, ${order.order_time}</td>
                      <td>${order.order_studio}</td>
                      <td>${order.order_seat}</td>
                      <td><span class="badge bg-label-success me-1">${order.order_status}</span></td>
                      <td>
<!--                        <button type="button" class="btn btn-outline-primary disabled">Pay</button>-->
<!--                        <button type="button" class="btn btn-outline-danger disabled">Cancel</button>-->
                      </td>
                    </tr>`
            } else {
                return `<tr>
                      <td>${order.order_username}</td>
                      <td><i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>${order.film_name}</strong></td>
                      <td>${order.order_date}, ${order.order_time}</td>
                      <td>${order.order_studio}</td>
                      <td>${order.order_seat}</td>
                      <td><span class="badge bg-label-danger me-1">${order.order_status}</span></td>
                      <td>
<!--                        <button type="button" class="btn btn-outline-primary disabled">Pay</button>-->
<!--                        <button type="button" class="btn btn-outline-danger disabled">Cancel</button>-->
                      </td>
                    </tr>`
            }

        })
        document.getElementById('order-table').innerHTML = orderList.join("");
    })

getAllFilm()
    .then(function (json) {
        const filmList = json['Data'].map((film => {
            if (film.film_selling > 0){
                return `<tr>
                      <td>${film.id_film}</td>
                      <td><img src="${film.film_poster}" style="width: 100px" alt="poster"/></td>
                      <td>${film.film_name}</td>
                      <td>${film.film_desc}</td>
                      <td>${film.category}</td>
                      <td>${film.film_duration}</td>
                      <td>${film.film_price}</td>
                      <td>${film.film_selling}</td>
                      <td>path: ${film.film_poster}</td>
                      <td>
                        <button type="button" class="btn btn-outline-primary" onclick="updatePoster(${film.id_film},'${film.film_name}')">Update Poster</button>
                        <button type="button" class="btn btn-outline-primary" onclick="editFilm(${film.id_film})">Edit</button>
                        <button type="button" class="btn btn-outline-danger disabled" onclick="deleteFilm(${film.id_film})">Delete</button>
                      </td>
                    </tr>`
            } else {
                return `<tr>
                      <td>${film.id_film}</td>
                      <td><img src="${film.film_poster}" style="width: 100px" alt="poster"/></td>
                      <td>${film.film_name}</td>
                      <td>${film.film_desc}</td>
                      <td>${film.category}</td>
                      <td>${film.film_duration}</td>
                      <td>${film.film_price}</td>
                      <td>${film.film_selling}</td>
                      <td>path: ${film.film_poster}</td>
                      <td>
                        <button type="button" class="btn btn-outline-primary" onclick="updatePoster(${film.id_film},'${film.film_name}')">Update Poster</button>
                        <button type="button" class="btn btn-outline-primary" onclick="editFilm(${film.id_film})">Edit</button>
                        <button type="button" class="btn btn-outline-danger" onclick="deleteFilm(${film.id_film})">Delete</button>
                      </td>
                    </tr>`
            }
        }))
        document.getElementById('film-table').innerHTML = filmList.join("");
    })


function deleteFilm(id_film) {
    Swal.fire({
        title: 'Delete film?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then(async (result) => {
        if (result.isConfirmed) {
            fetch('http://localhost:5000/film/' + id_film, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + localStorage.getItem('token')
                }
            })
                .then(function (response) {
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Film deleted Successfully',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        }).then(result => {
                            if (result.dismiss === Swal.DismissReason.timer) {
                                window.location.reload();
                            }
                        })
                    }
                })
        }
    })
}

function updatePoster(id_film, film_name){
    Swal.fire({
        title: 'Update poster?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Update'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const queryName= encodeURIComponent(film_name)
            await fetch(`https://api.themoviedb.org/3/search/movie?query=${queryName}&include_adult=false&language=en-US&page=1`, {
                method: "GET",
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZWJhOGY2MzFmNmY5ZTQ2YzNjOTliOGYyZDg3ODFlMyIsInN1YiI6IjY0ZTVjNjQ5NTI1OGFlMDBhZGQzNmE5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G_zNVXF1k3DYWu00KyZyAYY8JVqJuTvYodLOiZMhOwE'
                }
            }).then(response => response.json())
                .then(responseJson => {
                    const poster = 'https://image.tmdb.org/t/p/original' + responseJson['results'][0].poster_path
                    fetch('http://localhost:5000/film_poster/' + id_film, {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            "film_poster": poster
                        })
                    }).then(r => {
                        if (r.status === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Poster update successfully',
                                timer: 2000,
                                timerProgressBar: true,
                                showConfirmButton: false
                            }).then((result) => {
                                if (result.dismiss === Swal.DismissReason.timer) {
                                    window.location.reload();
                                }
                            })
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Failed',
                                text: 'Poster update failed',
                                timer: 2000,
                                timerProgressBar: true,
                                showConfirmButton: false
                            })
                        }
                    })
                })
        }
    })
}

getAllSchedule()
    .then(function (json){
        const date = new Date();
        let currentDay= String(date.getDate()).padStart(2, '0');
        let currentMonth = String(date.getMonth()+1).padStart(2,"0");
        let currentYear = date.getFullYear();
// we will display the date as DD-MM-YYYY
        let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;
        const scheduleList = json['Data'].map((schedule => {
            if (schedule.schedule_date >= currentDate){
                return `
                    <tr>
                      <td>${schedule.id_schedule}</td>
                      <td>${schedule.film_name}</td>
                      <td>${schedule.schedule_time} | ${schedule.schedule_date}</td>
                      <td>${schedule.schedule_studio}</td>
                      <td>${schedule.schedule_price}</td>
                      <td><span class="badge bg-label-success me-1">Active</span></td>
                      <td>
                        <button type="button" class="btn btn-outline-primary" onclick="editSchedule(${schedule.id_schedule},'${schedule.film_name}')">Edit</button>
                        <button type="button" class="btn btn-outline-danger" onclick="deleteSchedule(${schedule.id_schedule})">Delete</button>
                      </td>
                    </tr>
            `
            }

            // Activate Expired Schedule
            // else {
            //     return `
            //         <tr>
            //           <td>${schedule.id_schedule}</td>
            //           <td>${schedule.film_name}</td>
            //           <td>${schedule.schedule_time} | ${schedule.schedule_date}</td>
            //           <td>${schedule.schedule_studio}</td>
            //           <td>${schedule.schedule_price}</td>
            //           <td><span class="badge bg-label-danger me-1">Expired</span></td>
            //           <td>
            //             <button type="button" class="btn btn-outline-primary" onclick="editSchedule(${schedule.id_schedule})">Edit</button>
            //             <button type="button" class="btn btn-outline-danger" onclick="deleteSchedule(${schedule.id_schedule})">Delete</button>
            //           </td>
            //         </tr>
            // `
            // }
        }))
        document.getElementById('schedule-table').innerHTML = scheduleList.join("");
    })

function addSchedule(){
    const {value: formValues} = Swal.fire({
        title: 'Add Schedule',
        html:
            '<label for="film" class="form-label">Film</label>\n' +
            '<select class="form-select" name="film" id="swal-film_id">' +
            '   <option selected id="optionDefault">Select Film</option>' +
            fetch('http://localhost:5000/film/all',{
                method: "GET"
            }).then(function (response){
                return response.json()
            }).then(function (json){
                const filmList = json['Data'].map((film) => {
                    return `<option value="${film.id_film}">${film.film_name}</option>`
                })
                document.getElementById('optionDefault').insertAdjacentHTML("afterend", filmList.join(""));
            })
            +
            '</select>' +
            '<label for="schedule_studio" class="form-label">Studio</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-schedule_studio"\n' +
            '                        />'+
            '<label for="schedule_date" class="form-label">Date</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control date"\n' +
            '                          id="swal-schedule_date"\n' +
            '                          placeholder="Format: DD-MM-YYYY"\n' +
            '                        />'+
            '<label for="schedule_time" class="form-label">Time</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-schedule_time"\n' +
            '                          placeholder="Format: HH:MM"\n' +
            '                        />',
        focusConfirm: false,
        confirmButtonText: 'Save Changes',
        preConfirm: async () => {
            const id_film = Swal.getPopup().querySelector('#swal-film_id').value
            const schedule_studio = Swal.getPopup().querySelector('#swal-schedule_studio').value
            const schedule_date = Swal.getPopup().querySelector('#swal-schedule_date').value
            const schedule_time = Swal.getPopup().querySelector('#swal-schedule_time').value

            if (!id_film || !schedule_studio || !schedule_date || !schedule_time) {
                Swal.showValidationMessage(`Please fill all form`)
            }
            return {
                id_film: id_film,
                schedule_studio: schedule_studio,
                schedule_date: schedule_date,
                schedule_time: schedule_time,
            }
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            let dataFilm = {
                id_film: result.value.id_film,
                schedule_studio: result.value.schedule_studio,
                schedule_date: result.value.schedule_date,
                schedule_time: result.value.schedule_time
            }

            await fetch('http://localhost:5000/film_schedule', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + localStorage.getItem('token')
                },
                body: JSON.stringify(dataFilm)
            })
                .then(function (response) {
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Schedule Added Successfully',
                            showConfirmButton: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload()
                            }
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to Add Schedule',
                            timer: 2000,
                            timerProgressBar: true
                        })
                    }
                })
        }
    })
}

function editSchedule(id_schedule, film_name) {
    const {value: formValues} = Swal.fire({
        title: 'Edit Schedule',
        html:
            '<label for="id_schedule" class="form-label">Schedule ID</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-id_schedule"\n' +
            '                          value="' + id_schedule + '"\n' +
            '                          readonly' +
            '                        />' +
            '<label for="film_name" class="form-label">Film Name</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-film_name"\n' +
            '                          value="' + film_name + '"\n' +
            '                          readonly' +
            '                        />' +
            '<label for="schedule_studio" class="form-label">Studio</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-schedule_studio"\n' +
            '                        />'+
            '<label for="schedule_date" class="form-label">Date</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control date"\n' +
            '                          id="swal-schedule_date"\n' +
            '                          placeholder="Format: DD-MM-YYYY"\n' +
            '                        />'+
            '<label for="schedule_time" class="form-label">Time</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-schedule_time"\n' +
            '                          placeholder="Format: HH:MM"\n' +
            '                        />' +
            '<label for="schedule_price" class="form-label">Price</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-schedule_price"\n' +
            '                        />',
        focusConfirm:false,
        confirmButtonText: 'Save Changes',
        preConfirm: () => {
            const id_schedule = Swal.getPopup().querySelector('#swal-id_schedule').value
            const film_name = Swal.getPopup().querySelector('#swal-film_name').value
            const schedule_studio = Swal.getPopup().querySelector('#swal-schedule_studio').value
            const schedule_date = Swal.getPopup().querySelector('#swal-schedule_date').value
            const schedule_time = Swal.getPopup().querySelector('#swal-schedule_time').value
            const schedule_price = Swal.getPopup().querySelector('#swal-schedule_price').value
            if (!schedule_studio || !schedule_date || !schedule_time || !schedule_price){
                Swal.showValidationMessage(`Please fill all form`)
            }

            return {
                id_schedule: id_schedule,
                film_name: film_name,
                schedule_studio: schedule_studio,
                schedule_date: schedule_date,
                schedule_time: schedule_time,
                schedule_price: schedule_price
            }
        }
    }).then((result) => {
        if (result.isConfirmed){
            let dataSchedule = {
                id_schedule: result.value.id_schedule,
                film_name: result.value.film_name,
                schedule_studio: result.value.schedule_studio,
                schedule_date: result.value.schedule_date,
                schedule_time: result.value.schedule_time,
                schedule_price: result.value.schedule_price
            }

            fetch('http://localhost:5000/film_schedule/' + dataSchedule.id_schedule, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + localStorage.getItem('token')
                },
                body: JSON.stringify(dataSchedule)
            }).then(function (response) {
                if (response.status === 200) {
                    Swal.fire({
                        title: 'Success',
                        icon: 'success',
                        text: 'Schedule Updated Successfully',
                        confirmButtonText: 'Ok'
                    })
                        .then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            }
                        })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Update Failed',
                        timer: 2000,
                        timerProgressBar: true
                    })
                }
            })
        }
    })
}

function deleteSchedule(id_schedule) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await fetch('http://localhost:5000/film_schedule/' + id_schedule, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + localStorage.getItem('token')
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        Swal.fire({
                            title: 'Success',
                            icon: 'success',
                            text: 'Schedule Deleted Successfully',
                            confirmButtonText: 'Ok'
                        })
                            .then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                }
                            })
                    }
                })
        }
    })
}

function addFilm(){
    const {value: formValues} = Swal.fire({
        title: 'Add Film',
        html:
            '<label for="film_name" class="form-label">Name</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-film_name"\n' +
            '                        />' +
            '<label for="film_desc" class="form-label">Description</label>\n' +
            '                        <textarea class="form-control" id="swal-film_desc" rows="3"></textarea>' +
            '<label for="category" class="form-label">Category</label>\n' +
            '<select class="form-select" name="cat[]" multiple id="swal-category">' +
            +
                fetch('http://localhost:5000/category/all',{
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response){
                        return response.json()
                    })
                    .then(function (json){
                        const catList = json['Data'].map((cat) => {
                            return `<option value="${cat.id_category}">${cat.category_name}</option>`
                        })
                        document.getElementById('swal-category').innerHTML = catList.join("");
                    })
            +
            '</select>' +
            '<label for="film_duration" class="form-label">Duration</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-film_duration"\n' +
            '                        />' +
            '<label for="film_price" class="form-label">Price</label>\n' +
            '                        Rp. <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-film_price"\n' +
            '                        />',
        focusConfirm: false,
        confirmButtonText: 'Save Changes',
        preConfirm: async () => {

            const selectedOpt = []
            for (const option of document.getElementById('swal-category')) {
                if (option.selected) {
                    selectedOpt.push(option.value)
                }
            }

            const intOpt = selectedOpt.map(Number)

            const film_name = Swal.getPopup().querySelector('#swal-film_name').value
            const film_desc = Swal.getPopup().querySelector('#swal-film_desc').value
            const category = intOpt
            const film_duration = Swal.getPopup().querySelector('#swal-film_duration').value
            const film_price = Swal.getPopup().querySelector('#swal-film_price').value
            if (!film_name || !film_desc || !category || !film_duration || !film_price) {
                Swal.showValidationMessage(`Please fill all form`)
            }
            return {
                film_name: film_name,
                film_desc: film_desc,
                category: category,
                film_duration: film_duration,
                film_price: film_price
            }
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            let dataFilm = {
                film_name: result.value.film_name,
                film_desc: result.value.film_desc,
                film_duration: result.value.film_duration,
                film_price: result.value.film_price,
                id_category: result.value.category,
                film_selling: 0
            }

            await fetch('http://localhost:5000/film', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + localStorage.getItem('token')
                },
                body: JSON.stringify(dataFilm)
            })
                .then(function (response) {
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Film Added Successfully',
                            showConfirmButton: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload()
                            }
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Update Failed',
                            timer: 2000,
                            timerProgressBar: true
                        })

                    }
                })
        }
    })
}

function editFilm(id_film) {
    const {value: formValues} = Swal.fire({
        title: 'Edit Film',
        html:
            '<label for="id_film" class="form-label">Film ID</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-id_film"\n' +
            '                          value="' + id_film + '"\n' +
            '                          readonly' +
            '                        />' +
            '<label for="film_name" class="form-label">Name</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-film_name"\n' +
            '                        />' +
            '<label for="film_desc" class="form-label">Description</label>\n' +
            '                        <textarea class="form-control" id="swal-film_desc" rows="3"></textarea>' +
            '<label for="category" class="form-label">Category</label>\n' +
            '<select class="form-select" name="cat[]" multiple id="swal-category">' +
            +
                fetch('http://localhost:5000/category/all',{
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response){
                        return response.json()
                    })
                    .then(function (json){
                        const catList = json['Data'].map((cat) => {
                            return `<option value="${cat.id_category}">${cat.category_name}</option>`
                        })
                        document.getElementById('swal-category').innerHTML = catList.join("");
                    })
            +
            '</select>' +
            '<label for="film_duration" class="form-label">Duration</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-film_duration"\n' +
            '                        />' +
            '<label for="film_price" class="form-label">Price</label>\n' +
            '                        Rp. <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-film_price"\n' +
            '                        />',
        focusConfirm: false,
        confirmButtonText: 'Save Changes',
        preConfirm: async () => {
            const selectedOpt = []
            for (const option of document.getElementById('swal-category')) {
                if (option.selected) {
                    selectedOpt.push(option.value)
                }
            }

            const intOpt = selectedOpt.map(Number)

            const id_film = Swal.getPopup().querySelector('#swal-id_film').value
            const film_name = Swal.getPopup().querySelector('#swal-film_name').value
            const film_desc = Swal.getPopup().querySelector('#swal-film_desc').value
            const category = intOpt
            const film_duration = Swal.getPopup().querySelector('#swal-film_duration').value
            const film_price = Swal.getPopup().querySelector('#swal-film_price').value
            if (!film_name || !film_desc || !category || !film_duration || !film_price) {
                Swal.showValidationMessage(`Please fill all form`)
            }

            const queryName = encodeURIComponent(film_name)
            await fetch(`https://api.themoviedb.org/3/search/movie?query=${queryName}&include_adult=false&language=en-US&page=1`, {
                method: "GET",
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZWJhOGY2MzFmNmY5ZTQ2YzNjOTliOGYyZDg3ODFlMyIsInN1YiI6IjY0ZTVjNjQ5NTI1OGFlMDBhZGQzNmE5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G_zNVXF1k3DYWu00KyZyAYY8JVqJuTvYodLOiZMhOwE'
                }
            }).then(response => response.json())
                .then(responseJson => {
                    const poster = 'https://image.tmdb.org/t/p/original' + responseJson['results'][0].poster_path
                    console.log(poster)
                    fetch('http://localhost:5000/film_poster/' + id_film, {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            "film_poster": poster
                        })
                    }).then(r => {
                        if (r.status === 200) {
                            console.log("Uploaded" + poster)
                        } else {
                            console.log("Failed" + r.status)
                        }
                    })
                })

            return {
                id_film: document.querySelector('#swal-id_film').value,
                film_name: film_name,
                film_desc: film_desc,
                category: category,
                film_duration: film_duration,
                film_price: film_price
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let dataFilm = {
                id_film: result.value.id_film,
                film_name: result.value.film_name,
                film_desc: result.value.film_desc,
                film_duration: result.value.film_duration,
                film_price: result.value.film_price
            }

            const dataCat = {
                id_category: result.value.category
            }

            fetch('http://localhost:5000/film/' + dataFilm.id_film, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + localStorage.getItem('token')
                },
                body: JSON.stringify(dataFilm)
            })
                .then(function (response){
                    if (response.status === 200){
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Update Successfully',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        }).then((result) => {
                            if (result.dismiss === Swal.DismissReason.timer) {
                                fetch('http://localhost:5000/film_category/' + dataFilm.id_film, {
                                    method: "PUT",
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Basic ' + localStorage.getItem('token')
                                    },
                                    body: JSON.stringify(dataCat)
                                }).then(function (response){
                                    if (response.status === 200){
                                        sessionStorage.clear()
                                        window.location.reload();
                                    }
                                })
                            }
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Update Failed',
                            timer: 2000,
                            timerProgressBar: true
                        })

                    }
                })
        }
    })
}

getCategory()
    .then(function (json){
        const catList = json['Data'].map((cat) => {
            return `<tr>
                      <td>${cat.id_category}</td>
                      <td>${cat.category_name}</td>
                      <td>
                        <button type="button" class="btn btn-outline-primary" onclick="editCategory(${cat.id_category},'${cat.category_name}')">Edit</button>
                      </td>
                    </tr>`
        });
        document.getElementById('category-table').innerHTML = catList.join("");
    })

function addCategory(){
    const {value: formValues} = Swal.fire({
        title: 'Add Category',
        html:
            '<label for="category_name" class="form-label">Category</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          id="swal-category_name"\n' +
            '                        />',
        focusConfirm: false,
        confirmButtonText: 'Save Changes',
        preConfirm: async () => {
            const category_name = Swal.getPopup().querySelector('#swal-category_name').value
            if (!category_name){
                Swal.showValidationMessage(`Please fill all form`)
            }

            await fetch('http://localhost:5000/category', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    category_name: category_name
                })
            }).then(response => {
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Category Added Successfully',
                        showConfirmButton: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload()
                        }
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Category already exist',
                        timer: 2000,
                        timerProgressBar: true
                    })
                }
            })
        }
    })
}

function editCategory(id_category, category_name){
    const {value: formValues} = Swal.fire({
        title: 'Add Category',
        html:
            '<label for="category_name" class="form-label">Category</label>\n' +
            '                        <input\n' +
            '                          type="text"\n' +
            '                          class="form-control"\n' +
            '                          value="' + category_name + '"\n' +
            '                          id="swal-category_name"\n' +
            '                        />',
        focusConfirm: false,
        confirmButtonText: 'Save Changes',
        preConfirm: async () => {
            const category_name = Swal.getPopup().querySelector('#swal-category_name').value
            if (!category_name){
                Swal.showValidationMessage(`Please fill all form`)
            }

            await fetch('http://localhost:5000/category/' + id_category, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    category_name: category_name
                })
            }).then(response => {
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Edit Category Successfully',
                        showConfirmButton: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload()
                        }
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Category already exist',
                        timer: 2000,
                        timerProgressBar: true
                    })
                    console.log(response)
                }
            })
        }
    })
}

getReporting()
    .then(function (json) {
        const reportList = json['Data'].map((report => {
            return `<tr>
                      <td>${report.id_film}</td>
                      <td><img src="${report.film_poster}" style="width: 100px" alt="poster"/></td>
                      <td>${report.film_name}</td>
                      <td>${report.film_selling}</td>
                    </tr>`
        }))
        document.getElementById('reporting-table').innerHTML = reportList.join("");
    })