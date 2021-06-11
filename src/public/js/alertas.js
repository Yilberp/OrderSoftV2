function success(msg){
    Swal.fire({
        icon: 'success',
        title: msg,
        showConfirmButton: false,
        timer: 1500
    })
}

function error(msg){
    Swal.fire({
        icon: 'error',
        title: 'Opps... Ha ocurrido un error',
        text: msg,
        footer: '<p>Vuelve a intentarlo</p>'
    });
}
