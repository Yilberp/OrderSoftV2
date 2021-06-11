const CategoriaController = require("../controllers/CategoriaController");
module.exports = {
	viewIndex: async (req, res) => {
		const categorias = await CategoriaController.getCategorias();
		res.render("index", {
			user: req.user,
			categorias
		});
	},
};
