const { Router } = require("express");
const AdministradorController = require("../controllers/AdministradorController");
const IsAdmin = require("../middelwares/IsAdmin");
const upload = require("../services/uploadImage");
const router = Router();

router.route("/create/:secret/:email").get(AdministradorController.create);

router.use(IsAdmin);

router.route("/aprobar-producto").post(AdministradorController.aprobarProducto);

router
    .route("/actualizar-categoria")
    .post(AdministradorController.updateCategoria);

router
    .route("/actualizar-ingrediente")
    .post(AdministradorController.updateIngrediente);

router
    .route("/actualizar-producto")
    .get(AdministradorController.viewUpdateProducto)
    .post(upload.single("image"), AdministradorController.updateProducto);

router
    .route("/agregar-ingredientes-producto")
    .post(AdministradorController.setProductoIngrediente);

router
    .route("/eliminar-ingredientes-producto")
    .post(AdministradorController.deleteProductoIngrediente);

router
    .route("/categorias")
    .get(AdministradorController.viewCategorias)
    .post(AdministradorController.createCategoria);

router.route("/categoriasJSON").get(AdministradorController.viewCategoriasJSON);

router
    .route("/eliminar-categoria")
    .post(AdministradorController.deleteCategoria);

router
    .route("/eliminar-ingrediente")
    .post(AdministradorController.deleteIngrediente);

router.route("/eliminar-producto").post(AdministradorController.deleteProducto);

router
    .route("/estado-ingrediente")
    .post(AdministradorController.stateIngrediente);

router
    .route("/ingredientes")
    .get(AdministradorController.viewIngredientes)
    .post(AdministradorController.createIngrediente);

router
    .route("/ingredientesJSON")
    .get(AdministradorController.viewIngredientesJSON);

router
    .route("/ingredientes-producto/:id_producto/:accion")
    .get(AdministradorController.viewProductoIngrediente)
    .post(AdministradorController.viewProductoIngredienteJSON);

router
    .route("/productos")
    .get(AdministradorController.viewProductos)
    .post(AdministradorController.createProducto);

router.route("/productosJSON").get(AdministradorController.viewProductosJSON);

router
    .route("/nuevo-producto")
    .get(AdministradorController.viewCreateProducto)
    .post(upload.single("image"), AdministradorController.createProducto);
module.exports = router;
