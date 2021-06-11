var fila, user_id;
$(document).ready(function () {
    const url = `${location.origin}/administrador/ingredientesJSON`;
    tablaUsuarios = $("#users")
        .DataTable({
            ajax: {
                url: url,
                dataSrc: "",
            },
            columns: [
                { data: "id" },
                { data: "nombre" },
                { data: "stock" },
                { data: "precio" },
                { data: "extra" },
                {
                    defaultContent: `<button class='text-red-500 editor-update'><i class="fas fa-edit"></i></button> <button class='text-red-500 editor-delete'><i class='fa fa-trash'/></button>`,
                },
                {
                    defaultContent: `<button class='text-red-500 editor-change'><i class="fas fa-sync"></i></button>`,
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
                url: `${location.origin}/administrador/eliminar-ingrediente`,
                type: "POST",
                datatype: "json",
                data: { id },
                success: function () {
                    tablaUsuarios.row(fila.parents("tr")).remove().draw();
                    success(
                        `Se ha eliminado correctamente el ingrediente ${nombre}!`
                    );
                },
            });
        }
    });

    $("#users").on("click", ".editor-update", function (e) {
        e.preventDefault();
        fila = $(this);
        id = $(this).closest("tr").find("td:eq(0)").text();
        nombre = $(this).closest("tr").find("td:eq(1)").text();
        stock = $(this).closest("tr").find("td:eq(2)").text();
        precio = $(this).closest("tr").find("td:eq(3)").text();
        const form = document.forms[0];
        form.action = "/administrador/actualizar-ingrediente";
        form.elements.namedItem("id").value = id;
        form.elements.namedItem("nombre").value = nombre;
        form.elements.namedItem("stock").value = stock;
        form.elements.namedItem("precio").value = precio;
        form.querySelector("#id_cancelar").style.display = "block";
    });

    $("#users").on("click", ".editor-change", function (e) {
        e.preventDefault();
        fila = $(this);
        id = $(this).closest("tr").find("td:eq(0)").text();
        extra = $(this).closest("tr").find("td:eq(4)").text();
        const extraCambio = extra === "false" ? true : false;
        $.ajax({
            url: `${location.origin}/administrador/estado-ingrediente`,
            type: "POST",
            datatype: "json",
            data: { id, extra: extraCambio },
            success: function () {
                tablaUsuarios.ajax.reload(null, false);
                success(
                    `El estado del ingrediente se actualizado correctamente`
                );
            },
        });
    });
});

function createIngrediente(e) {
    e.style.display = "none";
    const form = document.forms[0];
    form.action = "/administrador/ingredientes";
    form.elements.namedItem("id").value = null;
    form.elements.namedItem("nombre").value = "";
    form.elements.namedItem("stock").value = "";
    form.elements.namedItem("precio").value = "";
}
