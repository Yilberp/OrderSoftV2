const { IngredienteProducto } = require("../repository/database/index").models;

module.exports = {
    create: async (id_producto, ingredientes) => {
        const ingredienteProducto = ingredientes.map((item) => {
            return { id_producto, id_ingrediente: item, extra: false };
        });
        const rowsDB = await IngredienteProducto.bulkCreate(
            ingredienteProducto,
            {
                returning: true,
            }
        );
        return rowsDB ? true : false;
    },
    delete: async (id_producto, ingredientes) => {
        try {
            await IngredienteProducto.destroy({
                where: {
                    id_producto,
                    id_ingrediente: ingredientes,
                },
            });
            return true;
        } catch (error) {
            return false;
        }
    },
    getCheck: async (id_producto) => {
        const ingredientesDB = await IngredienteProducto.findAll({
            where: { id_producto },
            attributes: ["id_ingrediente"],
        });
        return ingredientesDB.map((item) => {
            return item.getDataValue("id_ingrediente");
        });
    },
};
