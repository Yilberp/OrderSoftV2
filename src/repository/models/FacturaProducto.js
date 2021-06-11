const { DataTypes, QueryTypes } = require("sequelize");
const { sequelize } = require("../database");
const Factura = require("./Factura");
const Producto = require("./Producto");

const FacturaProducto = sequelize.define(
    "factura_producto",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_factura: {
            type: DataTypes.INTEGER,
            references: {
                model: Factura,
                key: "id",
            },
        },
        id_producto: {
            type: DataTypes.INTEGER,
            references: {
                model: Producto,
                key: "id",
            },
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        precio: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        } 
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = FacturaProducto;
