var fila, user_id;
$(document).ready(function () {
    const url = `${location.origin}/administrador/productosJSON`;
    tablaUsuarios = $("#users")
        .DataTable({
            ajax: {
                url: url,
                dataSrc: "",
            },
            columns: [
                { data: "id" },
                { data: "nombre" },
                { data: "categoria" },
                { data: "precio" },
                { data: "estado" },
                {
                    defaultContent: `<button class='text-red-500 editor-update'><i class="fas fa-edit"></i></button> <button class='text-red-500 editor-delete'><i class='fa fa-trash'/></button>`,
                },
                {
                    defaultContent: `<button class='text-red-500 editor-plus'><i class="fas fa-plus"></i></button> <button class='text-red-500 editor-minus'><i class="fas fa-minus"></i></button>`,
                },
                {
                    defaultContent: `<button class='text-red-500 editor-check'><i class="fas fa-check"></i></button>`,
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
        var respuesta = confirm(
            "¿Está seguro de borrar el registro " + id + "?"
        );
        if (respuesta) {
            $.ajax({
                url: `${location.origin}/administrador/eliminar-producto`,
                type: "POST",
                datatype: "json",
                data: { id },
                success: function () {
                    tablaUsuarios.row(fila.parents("tr")).remove().draw();
                },
            });
        }
    });
    $("#users").on("click", ".editor-update", function (e) {
        e.preventDefault();
        fila = $(this);
        id_producto = $(this).closest("tr").find("td:eq(0)").text();
        window.location.replace(
            `${location.origin}/administrador/actualizar-producto?id_producto=${id_producto}`
        );
    });
    $("#users").on("click", ".editor-plus", function (e) {
        e.preventDefault();
        fila = $(this);
        id_producto = $(this).closest("tr").find("td:eq(0)").text();
        window.location.replace(
            `${location.origin}/administrador/ingredientes-producto/${id_producto}/agregar`
        );
    });
    $("#users").on("click", ".editor-minus", function (e) {
        e.preventDefault();
        fila = $(this);
        id_producto = $(this).closest("tr").find("td:eq(0)").text();
        window.location.replace(
            `${location.origin}/administrador/ingredientes-producto/${id_producto}/eliminar`
        );
    });
    $("#users").on("click", ".editor-check", function (e) {
        e.preventDefault();
        fila = $(this);
        id = $(this).closest("tr").find("td:eq(0)").text();
        nombre = $(this).closest("tr").find("td:eq(1)").text();
        var respuesta = confirm(
            "¿Está seguro de aprobar el producto " + id + "?"
        );
        if (respuesta) {
            $.ajax({
                url: `${location.origin}/administrador/aprobar-producto`,
                type: "POST",
                datatype: "json",
                data: { id, nombre },
                success: function (res) {
                    if (res.ok) {
                        tablaUsuarios.row(fila.parents("tr")).remove().draw();
                        success(
                            `Se ha aprobado correctamente el producto ${nombre}!`
                        );
                    } else {
                        error("No pude aprobar un producto sin ingredientes");
                    }
                },
            });
        }
    });
});
