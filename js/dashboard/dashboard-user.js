async function getOrders(){
    const response = await fetch('http://localhost:5000/orders', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + localStorage.getItem('token')
        }
    });
    return await response.json();
}

async function getTickets(){
    const response = await fetch('http://localhost:5000/tickets', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + localStorage.getItem('token')
        }
    })
    return await response.json();
}

getOrders()
.then(function (json){
    const orderList = json['Data'].map((order)=>{
        if (order.order_status === 'Not Paid'){
            return `<tr>
                      <td><i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>${order.film_name}</strong></td>
                      <td>${order.order_date.slice(0,16)}, ${JSON.parse(order.order_time)}</td>
                      <td>${order.order_studio}</td>
                      <td>${order.order_seat}</td>
                      <td><span class="badge bg-label-warning me-1">${order.order_status}</span></td>
                      <td>${JSON.parse(order.order_expiration).slice(0,5)}</td>
                      <td>Rp. ${order.order_price}</td>
                      <td>
                        <button type="button" class="btn btn-outline-primary" onclick="payOrder(${order.id_order})">Pay</button>
                        <button type="button" class="btn btn-outline-danger" onclick="cancelOrder(${order.id_order})">Cancel</button>
                      </td>
                    </tr>`
        } else if (order.order_status === 'Paid'){
            return `<tr>
                      <td><i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>${order.film_name}</strong></td>
                      <td>${order.order_date.slice(0,16)}, ${JSON.parse(order.order_time)}</td>
                      <td>${order.order_studio}</td>
                      <td>${order.order_seat}</td>
                      <td><span class="badge bg-label-success me-1">${order.order_status}</span></td>
                      <td>${JSON.parse(order.order_expiration).slice(0,5)}</td>
                      <td>Rp. ${order.order_price}</td>
                      <td>
                        <button type="button" class="btn btn-outline-primary disabled">Pay</button>
                        <button type="button" class="btn btn-outline-danger disabled">Cancel</button>
                      </td>
                    </tr>`
        } else {
            return `<tr>
                      <td><i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>${order.film_name}</strong></td>
                      <td>${order.order_date.slice(0,16)}, ${JSON.parse(order.order_time)}</td>
                      <td>${order.order_studio}</td>
                      <td>${order.order_seat}</td>
                      <td><span class="badge bg-label-danger me-1">${order.order_status}</span></td>
                      <td>${JSON.parse(order.order_expiration).slice(0,5)}</td>
                      <td>Rp. ${order.order_price}</td>
                      <td>
                        <button type="button" class="btn btn-outline-primary disabled">Pay</button>
                        <button type="button" class="btn btn-outline-danger disabled">Cancel</button>
                      </td>
                    </tr>`
        }

    })
    document.getElementById('order-table').innerHTML = orderList.join("");
})

getTickets()
    .then(function (json){
        const ticketList = json['Data'].map((ticket)=>{
            if (ticket.ticket_status === 'Active'){
                return `<tr>
                      <td>${ticket.film_name}</td>
                      <td>${ticket.order_date.slice(0,16)}, ${JSON.parse(ticket.order_time)}</td>
                      <td>${ticket.order_studio}</td>
                      <td>${ticket.order_seat}</td>
                      <td><span class="badge bg-label-success me-1">${ticket.ticket_status}</span></td>
                      <td>
                        <button type="button" class="btn btn-outline-primary" onclick="seeTicket(${ticket.id_ticket})">See Ticket</button>
                      </td>
                    </tr>`
            } else {
                return `<tr>
                      <td>${ticket.film_name}</td>
                      <td>${ticket.order_date.slice(0,16)}, ${JSON.parse(ticket.order_time)}</td>
                      <td>${ticket.order_studio}</td>
                      <td>${ticket.order_seat}</td>
                      <td><span class="badge bg-label-danger me-1">${ticket.ticket_status}</span></td>
                      <td>
                        <button type="button" class="btn btn-outline-danger disabled">See Ticket</button>
                      </td>
                    </tr>`
            }
        })
        document.getElementById('ticket-table').innerHTML = ticketList.join("");
    })

async function seeTicket(id_ticket) {
    await fetch('http://localhost:5000/tickets/' + id_ticket, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + localStorage.getItem('token')
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            const data = json['Data']

            Swal.fire({
                title: 'Ticket Details',
                html:`
                <div class="card-body">
              <form id="formAccountSettings" method="POST" onsubmit="return false">
                <div class="row">
                  <div class="mb-3 col-md-12">
                    <label class="form-label">QR</label>
                    <label class="form-control"><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data.film_name}" alt="ticket qr"/></label>
                  </div>
                  <div class="mb-3 col-md-12">
                    <label class="form-label">Film Name</label>
                    <label class="form-control">${data.film_name}</label>
                  </div>
                  <div class="mb-3 col-md-12">
                    <label class="form-label">Date & Time</label>
                    <label class="form-control">${data.order_date.slice(0,16)}, ${JSON.parse(data.order_time)}</label>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Studio</label>
                    <label class="form-control">${data.order_studio}</label>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Seat</label>
                    <label class="form-control">${data.order_seat}</label>
                  </div>
                </div>
              </form>
            </div>
                `
            })
        })
}

function payOrder(id_order){
    fetch('http://localhost:5000/payments/' + id_order +'/pay', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + localStorage.getItem('token')
        }
    })
        .then(response => {
            if (response.status === 200) {
                Swal.fire({
                    title: 'Payment Confirmed!',
                    text: "Enjoy the movie!",
                    icon: 'success',
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
                    title: 'Payment Failed!',
                    text: 'Insufficient Balance',
                })
            }
        })
}

function cancelOrder(id_order){
    fetch('http://localhost:5000/payments/' + id_order +'/cancel', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + localStorage.getItem('token')
        }
    })
        .then(response => {
            if (response.status === 200) {
                Swal.fire({
                    title: 'Order Cancelled!',
                    icon: 'success',
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