const { EstadoProducto } = require("../repository/database/index").models;

module.exports = {
	getById: async (id) => await EstadoProducto.findByPk(id),
};
