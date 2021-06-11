const { DataTypes, QueryTypes } = require("sequelize");
const { sequelize } = require("../database");

const EstadoFactura = sequelize.define(
    "estado_factura",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        }
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = EstadoFactura;