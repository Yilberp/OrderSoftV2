const { DataTypes, QueryTypes } = require("sequelize");
const { sequelize } = require("../database");
const Cliente = require("./Cliente");

const Carrito = sequelize.define(
    "carritos",
    {
        id_cliente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Cliente,
                key: "id",
            },
        },
        valor_total: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = Carrito;
