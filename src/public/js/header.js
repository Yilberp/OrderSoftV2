const boton = document.querySelector('#boton');
const menu = document.querySelector('#menu');

boton.addEventListener('click', () => {
    console.log('click')
    menu.classList.toggle('hidden')
})

// modal
function ToggleModal(modalID){
    document.getElementById(modalID).classList.toggle("hidden");
}
function ToggleModalR(modalID,modalID2){
    document.getElementById(modalID).classList.toggle("hidden");
    document.getElementById(modalID2).classList.toggle("hidden");
}
function CloseModalR(modalID2){
    document.getElementById(modalID2).classList.toggle("hidden");
}

//drop
function handleClick() {
	const menu = document.querySelector("#dropmenu");
	if (menu.classList.contains("invisible")) {
		menu.classList.toggle("invisible");
		menu.classList.remove("opacity-0", "scale-95");
		menu.classList.add("opacity-100", "scale-100");
	} else {
		menu.classList.remove("ease-out", "duration-100");
		menu.classList.add("ease-in", "duration-75");
		menu.classList.remove("opacity-100", "scale-100");
		menu.classList.add("opacity-0", "scale-95");
		menu.classList.toggle("invisible");
	}
}