const { DataTypes, QueryTypes } = require("sequelize");
const { sequelize } = require("../database");

const Ingrediente = sequelize.define(
    "ingredientes",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        stock: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        precio: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        extra: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

Ingrediente.getStockIngrediente = async (id_factura_producto) =>
    await sequelize.query(
        `SELECT i.stock FROM ingredientes i JOIN ingrediente_producto_extra ipe ON ipe.id_ingrediente = i.id WHERE ipe.id_factura_producto = ${id_factura_producto}`,
        {
            type: QueryTypes.SELECT,
        }
    );

module.exports = Ingrediente;
