const { Ingrediente } = require("../repository/database/index").models;
const { IngredienteProductoExtra } =
    require("../repository/database/index").models;

module.exports = {
    create: async (id_factura_producto, adicionales) => {
        const ingredienteProducto = adicionales.map((item) => {
            return { id_factura_producto, id_ingrediente: item };
        });
        const rowsDB = await IngredienteProductoExtra.bulkCreate(
            ingredienteProducto,
            {
                returning: true,
            }
        );
        return rowsDB ? true : false;
    },
    getAdicionalesPreecompra: async (id_factura_producto) => {
        Ingrediente.hasMany(IngredienteProductoExtra, { foreignKey: "id" });
        IngredienteProductoExtra.belongsTo(Ingrediente, {
            foreignKey: "id_ingrediente",
        });
        return await IngredienteProductoExtra.findAll({
            where: { id_factura_producto },
            include: [Ingrediente],
        });
    },
};
