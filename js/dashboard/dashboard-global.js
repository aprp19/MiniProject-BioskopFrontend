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
const topUpBtn = document.getElementById('topUpWallet');
btn_logout.addEventListener('click', function(){
    localStorage.removeItem('token');
    window.location.href = '../../index.html';
})

topUpBtn.addEventListener('click', function(){
    Swal.fire({
        title: 'Top Up Wallet ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Top Up'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Top Up Successfully, Added Rp. 10000 to your wallet',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    topUp(localStorage.getItem('userId'), 10000);
                }
            })
        }
    })
})
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
        window.location.reload()
        return responses.json();
    })
}