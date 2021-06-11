const UsuarioController = require("../controllers/UsuarioController");

module.exports = async (req, res, next) => {
	if (req.isAuthenticated() && req.user.id_rol == process.env.ROL_ADMIN) {
		const { email, id_rol } = req.user;
		const admin = await UsuarioController.getUserSupervisor(email, id_rol);
		if (admin) {
			return next();
		}
		req.logout();
		return res.redirect("/login/supervisor");
	}
	req.logout();
	res.redirect("/");
};
