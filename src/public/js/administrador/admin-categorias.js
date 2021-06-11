var fila, user_id;
$(document).ready(function () {
    const url = `${location.origin}/administrador/categoriasJSON`;
    tablaUsuarios = $("#users")
        .DataTable({
            ajax: {
                url: url,
                dataSrc: "",
            },
            columns: [
                { data: "id" },
                { data: "nombre" },
                {
                    defaultContent: `<button class='text-red-500 editor-update'><i class="fas fa-edit"></i></button> <button class='text-red-500 editor-delete'><i class='fa fa-trash'/></button>`,
                },
            ],
            responsive: true,
        })
        .columns.adjust()
        .responsive.recalc();
    $("#users").on("click", ".editor-delete", function (e) {
        e.preventDefault();
        fila = $(this);
        id = $(this).closest("tr").find("td:eq(0)").text();
        nombre = $(this).closest("tr").find("td:eq(1)").text();
        var respuesta = confirm(
            "¿Está seguro de borrar el registro " + id + "?"
        );
        if (respuesta) {
            $.ajax({
                url: `${location.origin}/administrador/eliminar-categoria`,
                type: "POST",
                datatype: "json",
                data: { id },
                success: function () {
                    tablaUsuarios.row(fila.parents("tr")).remove().draw();
                    success(`Se ha eliminado correctamente la categoría ${nombre}!`);
                },
            });
        }
    });

    $("#users").on("click", ".editor-update", function (e) {
        e.preventDefault();
        fila = $(this);
        id = $(this).closest("tr").find("td:eq(0)").text();
        nombre = $(this).closest("tr").find("td:eq(1)").text();
        const form = document.forms[0];
        form.action = "/administrador/actualizar-categoria";
        form.elements.namedItem("id").value = id;
        form.elements.namedItem("nombre").value = nombre;
        form.querySelector("#id_cancelar").style.display = "block";
    });
});

function createCategoria(e) {
    e.style.display = "none";
    const form = document.forms[0];
    form.action = "/administrador/categorias";
    form.elements.namedItem("id").value = null;
    form.elements.namedItem("nombre").value = "";
}
