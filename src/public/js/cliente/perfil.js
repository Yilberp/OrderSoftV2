const main = document.getElementById('main-modal');
const content = document.getElementById('modal-content');
const type = document.getElementById('ipt-password');
const eye = document.getElementById('eye');
const eyeOff = document.getElementById('eye-off');
const type2 = document.getElementById('ipt-password2');
const eye2 = document.getElementById('eye2');
const eyeOff2 = document.getElementById('eye-off2');
const type3 = document.getElementById('ipt-password3');
const eye3 = document.getElementById('eye3');
const eyeOff3 = document.getElementById('eye-off3');
const form = document.getElementById('form');
function openModal (){
    main.classList.remove('opacity-0');
    main.classList.add('opacity-100');
    main.classList.toggle('invisible');
    content.classList.remove('translate-y-4','opacity-0');
    content.classList.add('translate-y-0','opacity-100');
}
function closeModal(){
    main.classList.remove('ease-out','duration-300','opacity-100');
    main.classList.add('ease-in','duration-200','opacity-0');
    content.classList.remove('ease-out','duration-300','translate-y-0','opacity-100');
    content.classList.add('ease-in','duration-200','translate-y-4','opacity-0');
    main.classList.toggle('invisible');
    form.reset();
}
function showHidePassword(){
    if(type.type == "password"){
        type.type = "text";
        eyeOff.classList.toggle('hidden');
        eye.classList.toggle('hidden');
    }else{
        type.type = "password";
        eyeOff.classList.toggle('hidden');
        eye.classList.toggle('hidden');
    }
}
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
function showHidePassword3(){
    if(type3.type == "password"){
        type3.type = "text";
        eyeOff3.classList.toggle('hidden');
        eye3.classList.toggle('hidden');
    }else{
        type3.type = "password";
        eyeOff3.classList.toggle('hidden');
        eye3.classList.toggle('hidden');
    }
}