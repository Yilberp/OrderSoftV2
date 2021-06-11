const { CarritoProducto } = require("../repository/database/index").models;

module.exports = {
    create: async (carritoProducto) => {
        const carritoProductoDB = await CarritoProducto.create(carritoProducto);
        return carritoProductoDB ? carritoProductoDB : false;
    },
    delete: async (id) => {
        const carritoProducto = await CarritoProducto.findByPk(id);
        if (carritoProducto) {
            carritoProducto.destroy();
            return true;
        }
        return false;
    },
    isCarritoProducto: async (id_carrito, id_producto) => {
        return await CarritoProducto.findOne({
            where: { id_carrito, id_producto },
        });
    },
    getCarrito: async (idCarrito) => {
        return await CarritoProducto.getCarrito(idCarrito);
    },
    update: async (id, cantidad) => {
        const carritoProducto = await CarritoProducto.findByPk(id);
        if (carritoProducto) {
            carritoProducto.cantidad = cantidad;
            carritoProducto.save();
            return true;
        }
        return false;
    },
};
