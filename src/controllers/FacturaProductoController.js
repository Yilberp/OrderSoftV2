const { FacturaProducto } = require("../repository/database/index").models;
const { Producto } = require("../repository/database/index").models;
const { Factura } = require("../repository/database/index").models;

module.exports = {
    create: async (facturaProducto) => {
        const facturaProductoDB = await FacturaProducto.create(facturaProducto);
        return facturaProductoDB ? facturaProductoDB : false;
    },
    delete: async (id) => {
        const facturaProductoDB = await FacturaProducto.findByPk(id);
        if (facturaProductoDB) {
            facturaProductoDB.destroy();
            return true;
        }
        return false;
    },
    find: async (id) => {
        return await FacturaProducto.findByPk(id);
    },
    getProductosPreecompra: async (id) => {
        Producto.hasMany(FacturaProducto, { foreignKey: "id" });
        FacturaProducto.belongsTo(Producto, { foreignKey: "id_producto" });
        Factura.hasMany(FacturaProducto, { foreignKey: "id" });
        FacturaProducto.belongsTo(Factura, { foreignKey: "id_factura" });
        return await FacturaProducto.findAll({
            where: { id },
            include: [Producto, Factura],
        });
    },
    updateFactura: async (id, id_factura) => {
        const facturaProductoDB = await FacturaProducto.findByPk(id);
        if (facturaProductoDB) {
            facturaProductoDB.id_factura = id_factura;
            facturaProductoDB.save();
        }
    },
};
