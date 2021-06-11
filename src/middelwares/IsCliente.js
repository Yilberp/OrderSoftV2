const UsuarioController = require("../controllers/UsuarioController");

module.exports = async (req, res, next) => {
	if (req.isAuthenticated() && req.user.id_rol == process.env.ROL_CLIENTE) {
		const { email } = req.user;
        const cliente = await UsuarioController.getClienteByEmail(email);
		if (cliente) {
			return next();
		}
		req.logout();
		return res.redirect("/login");
	}
	req.logout();
	res.redirect("/");
};
