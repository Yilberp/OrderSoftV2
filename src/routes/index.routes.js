const { Router } = require("express");
const AdministradorRoutes = require("./administrador.routes");
const ClienteRoutes = require("./cliente.routes");
const IndexController = require("../controllers/IndexController");
const IsNotAdmin = require("../middelwares/IsNotAdmin");
const LoginController = require("../controllers/LoginController");
const LoginRoutes = require("./login.routes");
const ProductoRoutes = require("./producto.routes");
const router = Router();

router.use("/administrador", AdministradorRoutes);
router.route("/logout").get(LoginController.logout);
router.use(IsNotAdmin);
router.route("/").get(IndexController.viewIndex);
router.use("/cliente", ClienteRoutes);
router.use("/login", LoginRoutes);
router.use("/producto", ProductoRoutes);
module.exports = router;
