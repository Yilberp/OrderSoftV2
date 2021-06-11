const { Carrito } = require("../repository/database/index").models;

module.exports = {
    create: async (id_cliente) => {
        const carritoDB = await Carrito.create({ id_cliente, valor_total: 0 });
        return carritoDB ? true : false;
    },
    update: async (id_cliente, valor_total) => {
        const carritoDB = await Carrito.findByPk(id_cliente);
        if (carritoDB) {
            carritoDB.valor_total = valor_total;
            carritoDB.save();
        }
    },
    getTotal: async (id_cliente) => {
        const carritoDB = await Carrito.findByPk(id_cliente);
        return carritoDB.getDataValue("valor_total");
    },
};
