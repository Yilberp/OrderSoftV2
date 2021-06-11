const { DataTypes, QueryTypes } = require("sequelize");
const { sequelize } = require("../database");
const Ingrediente = require("./Ingrediente");
const FacturaProducto = require("./FacturaProducto");

const IngredienteProductoExtra = sequelize.define(
    "ingrediente_producto_extra",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_factura_producto: {
            type: DataTypes.INTEGER,
            references: {
                model: FacturaProducto,
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        id_ingrediente: {
            type: DataTypes.INTEGER,
            references: {
                model: Ingrediente,
                key: "id",
            },
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = IngredienteProductoExtra;
