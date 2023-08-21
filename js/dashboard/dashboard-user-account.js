const inputName = document.getElementById('inputName');
const inputUsername = document.getElementById('inputUsername');
const inputPassword = document.getElementById('inputPassword');

const submitBtn = document.getElementById('submitAccount');
const deleteBtn = document.getElementById('deleteAccount');

async function getUserDetails(){
    const response = await fetch('http://localhost:5000/account/self', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + localStorage.getItem('token')
        }
    });
    return await response.json();
}

getUserDetails().then(function (json){
    inputName.placeholder = json['Data'].u_name;
    inputUsername.placeholder = json['Data'].u_username;
})

submitBtn.addEventListener('click', function(){
    const data = {
        u_name: inputName.value,
        u_username: inputUsername.value,
        u_password: inputPassword.value
    }
    fetch('http://localhost:5000/account/self',{
        method: 'PUT',
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
                        const token = btoa(inputUsername.value + ':' + inputPassword.value);
                        localStorage.setItem('token', token)
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
        .catch(function (error) {
            console.log(error);
        })
})

deleteBtn.addEventListener('click', function(){

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('http://localhost:5000/account/self',{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + localStorage.getItem('token')
                }
            })
                .then(function (response){
                    if (response.status === 200){
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Delete Successfully',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        }).then((result) => {
                            if (result.dismiss === Swal.DismissReason.timer) {
                                localStorage.removeItem('token');
                                window.location.href = '../../index.html';
                            }
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    })
})