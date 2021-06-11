const { Valoracion } = require("../repository/database/index").models;

module.exports = {
    getValoracionesByProducto: async (id_producto, offset) => {
        return await Valoracion.findAndCountAll({
            where: { id_producto },
            limit: 5,
            offset: Number(offset),
        });
    },
    getCount: async (id_producto) => {
        return await Valoracion.count({ where: { id_producto } });
    },
    getCountCal1: async (id_producto) => {
        return await Valoracion.count({
            where: { id_producto, calificacion: 1 },
        });
    },
    getCountCal2: async (id_producto) => {
        return await Valoracion.count({
            where: { id_producto, calificacion: 2 },
        });
    },
    getCountCal3: async (id_producto) => {
        return await Valoracion.count({
            where: { id_producto, calificacion: 3 },
        });
    },
    getCountCal4: async (id_producto) => {
        return await Valoracion.count({
            where: { id_producto, calificacion: 4 },
        });
    },
    getCountCal5: async (id_producto) => {
        return await Valoracion.count({
            where: { id_producto, calificacion: 5 },
        });
    },
};
