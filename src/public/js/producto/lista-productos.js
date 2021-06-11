function getDataHidden() {
    try {
        return document.getElementById('idDataHidden').value;
    } catch (err) {
        return false;
    }
}

// async function getProductos(data = getDataHidden()) {
//     const categorias = Array.from(document.querySelectorAll('input:checked')).map(item => Number(item.value));
//     const url = !data ? `producto/search/0` : `producto/search`;
//     let productos = '';
//     const body = JSON.stringify({ categorias, data });
//     const result = await fetch(`${location.origin}/${url}`, {
//         method: 'POST',
//         body,
//         headers: {
//             'Content-Type': 'application/json'
//         },
//     }).then(response => response.json());
//     result.map(producto => {
//         productos += `
//             <div class="container__products">
//         <div class="container__products--details">
//             <img class="container__products--img" src="/${producto.imagen}" alt="Producto">
//             <div class="container__products--title">
//                 <p>
//                     ${producto.nombre}
//                 </p>
//                 <span>
//                     ${producto.precio}
//                 </span>
//             </div>
//         </div>
//         <div class="container__products--options">
//             <span>
//                 ${producto.descripcion}
//             </span>
//             <a class="ver-producto-a" href="/producto/${producto.id}">Ver Producto</a>
//         </div>
//     </div>
//         `;
//     });
//     document.getElementById('productosJSON').innerHTML = productos;
// }

function handleOption(){
	const mas = document.querySelector("#mas");
	const contenido = document.querySelector("#contenido");
	const oculto1 = document.querySelector("#ocultar1");
	const oculto2 = document.querySelector("#ocultar2");
    if (mas.classList.contains("invisible")) {
		mas.classList.toggle("invisible");
        oculto1.classList.toggle("overflow-hidden");
		oculto1.classList.remove("h-auto");
		oculto1.classList.add("h-0");
		oculto2.classList.toggle("hidden");
		contenido.classList.remove("opacity-100", "scale-100");
		contenido.classList.add("opacity-0", "scale-95");
        contenido.classList.toggle("invisible");
    }else{
		mas.classList.toggle("invisible");
		oculto1.classList.toggle("overflow-hidden");
		oculto1.classList.remove("h-0");
		oculto1.classList.add("h-auto");
		oculto2.classList.toggle("hidden");
		contenido.classList.remove("opacity-0", "scale-95");
		contenido.classList.add("opacity-100", "scale-100");
        contenido.classList.toggle("invisible");
    }
}
function handleOption2(){
    const mas1 = document.querySelector("#mas1");
	const contenido1 = document.querySelector("#contenido1");
	const oculto3 = document.querySelector("#ocultar3");
	const oculto4 = document.querySelector("#ocultar4");
    if (mas1.classList.contains("invisible")) {
		mas1.classList.toggle("invisible");
        oculto3.classList.toggle("overflow-hidden");
		oculto3.classList.remove("h-auto");
		oculto3.classList.add("h-0");
		oculto4.classList.toggle("hidden");
		contenido1.classList.remove("opacity-100", "scale-100");
		contenido1.classList.add("opacity-0", "scale-95");
        contenido1.classList.toggle("invisible");
    }else{
		mas1.classList.toggle("invisible");
		oculto3.classList.toggle("overflow-hidden");
		oculto3.classList.remove("h-0");
		oculto3.classList.add("h-auto");
		oculto4.classList.toggle("hidden");
		contenido1.classList.remove("opacity-0", "scale-95");
		contenido1.classList.add("opacity-100", "scale-100");
        contenido1.classList.toggle("invisible");
    }
}

function range() {
    return {
        minprice: 0,
        maxprice: 10000,
        min: 0,
        max: 10000,
        minthumb: 0,
        maxthumb: 0,
        mintrigger() {
            this.validation();
            this.minprice = Math.min(this.minprice, this.maxprice - 500);
            this.minthumb = ((this.minprice - this.min) / (this.max - this.min)) * 100;
        },
        maxtrigger() {
            this.validation();
            this.maxprice = Math.max(this.maxprice, this.minprice + 200);
            this.maxthumb = 100 - (((this.maxprice - this.min) / (this.max - this.min)) * 100);
        },
        validation() {
            if (/^\d*$/.test(this.minprice)) {
                if (this.minprice > this.max) {
                    this.minprice = 9500;
                }
                if (this.minprice < this.min) {
                    this.minprice = this.min;
                }
            } else {
                this.minprice = 0;
            }
            if (/^\d*$/.test(this.maxprice)) {
                if (this.maxprice > this.max) {
                    this.maxprice = this.max;
                }
                if (this.maxprice < this.min) {
                    this.maxprice = 200;
                }
            } else {
                this.maxprice = 10000;
            }
        }
    }
}