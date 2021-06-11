const { Factura } = require("../repository/database/index").models;

module.exports = {
    create: async (factura) => {
        const facturaDB = await Factura.create(factura);
        return facturaDB ? facturaDB : false;
    },
    delete: async (id) => {
        const facturaDB = await Factura.findByPk(id);
        if (facturaDB) {
            facturaDB.destroy();
            return true;
        }
        return false;
    },
    updateEstadoCompra: async (id, fecha, total) => {
        const facturaDB = await Factura.findByPk(id);
        if (facturaDB) {
            facturaDB.fecha = fecha;
            facturaDB.estadoFactura = 1;
            facturaDB.total = total;
            facturaDB.save();
        }
    },
    updateTotal: async (id, total) => {
        const facturaDB = await Factura.findByPk(id);
        if (facturaDB) {
            facturaDB.total = total;
            facturaDB.save();
        }
    },
    getCarrito: async (id_cliente) => {
        return await Factura.getCarrito(id_cliente);
    },
    getProductoIds: async (id_cliente) => {
        const ids_factura_producto = await Factura.getProductoIds(id_cliente);
        return ids_factura_producto.map((item) => {
            return item.id;
        });
    },
    getFacturaProductoIds: async (id_cliente, id_producto) => {
        const ids_factura_producto = await Factura.getFacturaProductoIds(
            id_cliente,
            id_producto
        );
        return ids_factura_producto.map((item) => {
            return item.id;
        });
    },
    getIngredientesIds: async (id_factura_producto) => {
        const ids_ingredientes = await Factura.getIngredientesIds(
            id_factura_producto
        );
        return ids_ingredientes.map((item) => {
            return item.id_ingrediente;
        });
    },
};
