const { Router } = require("express");
const ClienteController = require("../controllers/ClienteController");
const IsCliente = require("../middelwares/IsCliente");
const upload = require("../services/uploadImage");
const router = Router();

router.use(IsCliente);

router
    .route("/carrito")
    .get(ClienteController.viewCarrito)
    .post(ClienteController.guardarCarrito);
router.route("/carrito-delete").post(ClienteController.deleteCarrito);
router.route("/carrito-update").post(ClienteController.updateCarrito);
router.route("/cambio-contrasena").post(ClienteController.cambioContrasena);
router
    .route("/perfil")
    .get(ClienteController.viewPerfil)
    .post(upload.single("image"), ClienteController.perfil);
router.route("/precompra/:id").get(ClienteController.viewPrecompra);
router.route("/compra").post(ClienteController.compra);
module.exports = router;
