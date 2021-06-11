var totalRegistros = undefined;
var botones = undefined;
var actual = 0;

function stars(cantidad) {
    let str = "";
    for (let i = 0; i < cantidad; i++) {
        str += `<span class="material-icons">star</span>`;
    }
    return str;
}

function preview(e) {
    if (actual >= 4) actual = actual - 5;
    tirar();
}

function next() {
    if (actual <= totalRegistros) actual = actual + 5;
    tirar();
}

function starsOff(cantidad) {
    let str = "";
    for (let i = 0; i < 5 - cantidad; i++) {
        str += `<span class="material-icons">star_outline</span>`;
    }
    return str;
}

function titulo(cantidad) {
    let calificacion = [0, "Muy malo", "Malo", "Regular", "Bueno", "Excelente"];
    return calificacion[cantidad];
}

const id = document.getElementById("idReq").value;
let valoraciones = [];

function tirar() {
    fetch(
        `${location.origin}/producto/getValoraciones?id=${id}&offset=${actual}`
    )
        .then((response) => response.json())
        .then((data) => {
            if (!totalRegistros & !botones) {
                totalRegistros = data.count;
                botones = Math.ceil(totalRegistros / 5);
            }
            valoraciones = [];
            const cont = document.querySelector("#content");
            cont.innerHTML = "";
            let str = "";
            data.rows.forEach((item) => {
                str += `<div class="px-4 mb-3">
                <div class="mb-2 text-red-500">
                    ${stars(item.calificacion)}
                    ${starsOff(item.calificacion)}
                </div>
                <h2 class="font-semibold">${titulo(item.calificacion)}</h2>
                <p class="mt-2">${item.comentario}</p>
                 </div>`;
            });
            cont.innerHTML = str;
        });
}

tirar();

function handle1() {
    const mas = document.querySelector("#mas1");
    mas.classList.toggle("invisible");
}

function handle() {
    const mas = document.querySelector("#mas");
    mas.classList.toggle("invisible");
}