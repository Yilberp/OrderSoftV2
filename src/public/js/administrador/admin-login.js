const type2 = document.getElementById('ipt-password2');
const eye2 = document.getElementById('eye2');
const eyeOff2 = document.getElementById('eye-off2');

function showHidePassword2(){
    if(type2.type == "password"){
        type2.type = "text";
        eyeOff2.classList.toggle('hidden');
        eye2.classList.toggle('hidden');
    }else{
        type2.type = "password";
        eyeOff2.classList.toggle('hidden');
        eye2.classList.toggle('hidden');
    }
}