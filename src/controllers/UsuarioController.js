const { Op } = require("sequelize");
const { Usuario } = require("../repository/database/index").models;
module.exports = {
    create: async ({ email, contrasena, id_rol }) => {
        const userDB = await Usuario.create({
            email,
            contrasena: Usuario.encryptPassword(contrasena),
            id_rol,
        });
        if (userDB) return userDB;
        return false;
    },
    getBy: async (query) => await Usuario.findOne({ where: query }),
    getByEmail: async (email) => await Usuario.findOne({ where: { email } }),
    getById: async (id) => await Usuario.findByPk(id),
    getClienteByEmail: async (email) =>
        await Usuario.findOne({
            where: { email, id_rol: process.env.ROL_CLIENTE },
        }),
    getUserSupervisor: async (email, id_rol) =>
        await Usuario.findOne({
            where: {
                [Op.and]: [{ id_rol, email }],
                id_rol: { [Op.not]: process.env.ROL_CLIENTE },
            },
        }),
};
