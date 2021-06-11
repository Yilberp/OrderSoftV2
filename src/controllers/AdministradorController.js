const CategoriaController = require("../controllers/CategoriaController");
const EstadoProductoController = require("../controllers/EstadoProductoController");
const UsuarioController = require("../controllers/UsuarioController");
const IngredienteController = require("../controllers/IngredienteController");
const IngredienteProductoController = require("../controllers/IngredienteProductoController");
const ProductoController = require("./ProductoController");

module.exports = {
    aprobarProducto: async (req, res) => {
        const id_producto = req.body.id;
        const id_ingredientes = await IngredienteProductoController.getCheck(
            id_producto
        );
        console.log(id_ingredientes);
        if (!id_ingredientes.length > 0) return res.json({ ok: false });
        const producto = await ProductoController.aprobar(req.body);
        return res.json({ ok: true });
    },
    create: async (req, res) => {
        const { secret, email } = req.params;
        if (secret == process.env.SECRET_ADMIN) {
            await UsuarioController.create({
                email,
                contrasena: process.env.PASS_ADMIN,
                id_rol: process.env.ROL_ADMIN,
            });
        }
        return res.redirect("/");
    },
    createCategoria: async (req, res) => {
        const categoria = await CategoriaController.create(req.body);
        if (categoria) {
            req.flash(
                "success",
                `Categoría ${categoria.nombre} creada correctamente`
            );
        } else {
            req.flash(
                "error",
                `Ha ocurrido un error al crear la categoría ${categoria.nombre}`
            );
        }
        return res.redirect("/administrador/categorias");
    },
    createIngrediente: async (req, res) => {
        const ingrediente = await IngredienteController.create(req.body);
        if (ingrediente) {
            req.flash(
                "success",
                `Ingrediente ${ingrediente.nombre} creada correctamente`
            );
        } else {
            req.flash("error", `Ha ocurrido un error al crear el ingrediente.`);
        }
        return res.redirect("/administrador/ingredientes");
    },
    createProducto: async (req, res) => {
        const producto = ({ nombre, descripcion, id_categoria, precio } =
            req.body);
        const imagen = req.file.originalname;
        producto.imagen = imagen;
        const productoDB = await ProductoController.create(producto);
        if (productoDB) {
            req.flash(
                "success",
                `Se ha creado correctamente el producto ${productoDB.nombre}`
            );
        } else {
            req.flash(
                "error",
                `Ha ocurrido un error al crear el producto ${productoDB.nombre}`
            );
        }
        return res.redirect("/administrador/nuevo-producto");
    },
    deleteCategoria: async (req, res) => {
        const { id } = req.body;
        const categoria = await CategoriaController.delete(id);
        if (categoria) {
            req.flash(
                "success",
                `Se ha eliminado correctamente la categoría ${categoria.nombre}!`
            );
        } else {
            req.flash(
                "error",
                `La categoría que ha intentado eliminar no  existe!`
            );
        }
        return res.redirect("/administrador/categorias");
    },
    deleteIngrediente: async (req, res) => {
        const { id } = req.body;
        const ingrediente = await IngredienteController.delete(id);
        if (ingrediente) {
            req.flash(
                "success",
                `Se ha eliminado correctamente el ingrediente ${ingrediente.nombre}!`
            );
        } else {
            req.flash(
                "error",
                `EL ingrediente que ha intentado eliminar no  existe!`
            );
        }
        return res.redirect("/administrador/ingredientes");
    },
    deleteProducto: async (req, res) => {
        const { id } = req.body;
        const result = await ProductoController.delete(id);
        result == 1
            ? req.flash("success", "Producto eliminado correctamente")
            : req.flash(
                  "error",
                  "Error al eliminar el producto, inténtelo nuevamente"
              );
        return res.redirect("/administrador/productos");
    },
    deleteProductoIngrediente: async (req, res) => {
        const { id, ingredientes } = req.body;
        const result = await IngredienteProductoController.delete(
            id,
            ingredientes
        );
        res.json({ result });
    },
    updateCategoria: async (req, res) => {
        const categoria = await CategoriaController.update(req.body);
        if (categoria) {
            req.flash(
                "success",
                `Categoría ${categoria.nombre} actualizada correctamente`
            );
        } else {
            req.flash(
                "error",
                `Ha ocurrido un error al actualizar la categoría ${categoria.nombre}`
            );
        }
        return res.redirect("/administrador/categorias");
    },
    updateIngrediente: async (req, res) => {
        const ingrediente = await IngredienteController.update(req.body);
        if (ingrediente) {
            req.flash(
                "success",
                `Ingrediente ${ingrediente.nombre} actualizado correctamente`
            );
        } else {
            req.flash(
                "error",
                `Ha ocurrido un error al actualizar el ingrediente ${ingrediente.nombre}`
            );
        }
        return res.redirect("/administrador/ingredientes");
    },
    updateProducto: async (req, res) => {
        const producto = ({ nombre, descripcion, id, id_categoria, precio } =
            req.body);
        const imagen = req.file ? req.file.originalname : req.body.url_image;
        producto.imagen = imagen;
        const productoDB = await ProductoController.update(producto);
        if (productoDB) {
            req.flash(
                "success",
                `Se ha actualizdo correctamente el producto ${productoDB.nombre}`
            );
        } else {
            req.flash(
                "error",
                `Ha ocurrido un error al actualizar el producto ${productoDB.nombre}`
            );
        }
        return res.redirect("/administrador/productos");
    },
    setProductoIngrediente: async (req, res) => {
        const { id, ingredientes } = req.body;
        const result = await IngredienteProductoController.create(
            id,
            ingredientes
        );
        res.json({ result });
    },
    stateIngrediente: async (req, res) => {
        const ingrediente = await IngredienteController.changeState(req.body);
        if (ingrediente) {
            req.flash(
                "success",
                `El estado del ingrediente se actualizado correctamente`
            );
        } else {
            req.flash(
                "error",
                `Ha ocurrido un error al actualizar el estado del ingrediente`
            );
        }
        return res.redirect("/administrador/ingredientes");
    },
    viewCategorias: async (req, res) => {
        const categorias = await CategoriaController.getCategorias();
        res.render("administrador/admin-categorias", { categorias });
    },
    viewCategoriasJSON: async (req, res) => {
        const categorias = await CategoriaController.getCategorias();
        res.json(categorias);
    },
    viewCreateProducto: async (req, res) => {
        const categorias = await CategoriaController.getCategorias();
        res.render("administrador/nuevo-producto", { categorias });
    },
    viewIngredientes: async (req, res) => {
        const categorias = await CategoriaController.getCategorias();
        res.render("administrador/admin-ingredientes", {
            categorias,
        });
    },
    viewIngredientesJSON: async (req, res) => {
        const ingredientes = await IngredienteController.getIngredientes();
        res.json(ingredientes);
    },
    viewUpdateProducto: async (req, res) => {
        const { id_producto } = req.query;
        const productoDB = await ProductoController.getById(id_producto);
        const categorias = await CategoriaController.getCategorias();
        res.render("administrador/nuevo-producto", {
            categorias,
            productoDB,
        });
    },
    viewProductos: async (req, res) => {
        const categorias = await CategoriaController.getCategorias();
        res.render("administrador/admin-productos", { categorias });
    },
    viewProductosJSON: async (req, res) => {
        const productos = await ProductoController.getProductosRevision();
        res.json(productos);
    },
    viewProductoIngrediente: async (req, res) => {
        const { id_producto, accion } = req.params;
        const producto = await ProductoController.getById(id_producto);
        res.render("administrador/admin-producto-ingrediente.hbs", {
            accion,
            producto,
        });
    },
    viewProductoIngredienteJSON: async (req, res) => {
        const { id_producto, accion } = req.params;
        const id_ingredientes = await IngredienteProductoController.getCheck(
            id_producto
        );
        let ingredientes;
        if (accion === "agregar") {
            ingredientes = await IngredienteController.getIngredientesNotCheck(
                id_ingredientes
            );
        }
        if (accion === "eliminar") {
            ingredientes = await IngredienteController.getIngredientesCheck(
                id_ingredientes
            );
        }
        return res.json(ingredientes);
    },
};
