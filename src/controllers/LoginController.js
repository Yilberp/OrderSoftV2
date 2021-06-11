module.exports = {
	viewLoginSupervisor: (req, res) => {
		res.render("administrador/admin-login");
	},
	logout: (req, res) => {
		req.logout();
		res.redirect("/");
	},
};
