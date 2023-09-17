const dashboardMenu = document.getElementById('dashboard-menu')
if (localStorage['auth'] === 'Admin') {
    dashboardMenu.innerHTML = `<a href="../../Dashboard/html/dashboard-admin.html" class="menu-link" id="dashboard-nav">
            <i class="menu-icon tf-icons bx bxs-dashboard"></i>
            <div data-i18n="Analytics" id="dashboard-text">Dashboard</div>
          </a>`
} else {
    dashboardMenu.innerHTML = `<a href="../../Dashboard/html/dashboard-user.html" class="menu-link" id="dashboard-nav">
            <i class="menu-icon tf-icons bx bx-cart"></i>
            <div data-i18n="Analytics" id="dashboard-text">Dashboard</div>
          </a>`
}


async function getUser(){
    const response = await fetch('http://localhost:5000/account/self', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + localStorage.getItem('token')
        }
    });
    return await response.json();
}

getUser()
    .then(function (json){
        const userId = json['Data'].id_user;
        localStorage.setItem('userId', userId);
        document.getElementById('currentWallet').innerText = 'Rp. ' + json['Data'].wallet;
        document.getElementById('username').innerText = json['Data'].u_name;
        document.getElementById('user-role').innerText = json['Data'].u_role;
    })

async function alreadyLoggedIn(){
    return localStorage.getItem('token');
}

alreadyLoggedIn().then(function (token){
    if (!token){
        window.location.href = '../../index.html';
    }
})

const btn_logout = document.getElementById('logout-button');
// const topUpBtn = document.getElementById('topUpWallet');
btn_logout.addEventListener('click', function(){
    localStorage.removeItem('token');
    window.location.href = '../../index.html';
})


function topUpBtn(userId){
    Swal.fire({
        title: 'Top Up Wallet ?',
        icon: 'question',
        input: 'number',
        inputPlaceholder: 'Rp. 10000',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Top Up'
    }).then((result) => {
        if (result.isConfirmed) {
            let topupAmount = result.value
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: `Top Up Successfully, Added Rp. ${result.value} to your wallet`,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.log(topupAmount);
                    topUp(userId, topupAmount);
                }
            })
        }
    })
}


function topUp(id_user, amount) {
    fetch('http://localhost:5000/wallet/topup/' + id_user, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
            "w_balance": amount
        })
    }).then(responses => {
        if (responses.status === 200) {
            window.location.reload();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Top Up Failed',
            })
        }
    })
}