const UsuarioController = require("../controllers/UsuarioController");

module.exports = async (req, res, next) => {
	if (!req.isAuthenticated() || ( req.isAuthenticated() && req.user.id_rol != process.env.ROL_ADMIN)) {
		return next();
	}
	res.redirect("/administrador/nuevo-producto");
};
