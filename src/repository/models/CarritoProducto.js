const { DataTypes, QueryTypes } = require("sequelize");
const { sequelize } = require("../database");
const Carrito = require("./Carrito");
const Producto = require("./Producto");

const CarritoProducto = sequelize.define(
    "carrito_producto",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_carrito: {
            type: DataTypes.INTEGER,
            references: {
                model: Carrito,
                key: "id_cliente",
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
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

CarritoProducto.getCarrito = async (idCarrito) =>
    await sequelize.query(
        `SELECT cp.id, cp.id_producto, p.imagen, p.nombre, cp.cantidad, cp.precio, cp.cantidad*cp.precio as total FROM carrito_producto cp JOIN productos p ON p.id = cp.id_producto WHERE cp.id_carrito = ${idCarrito}`,
        {
            type: QueryTypes.SELECT,
        }
    );

module.exports = CarritoProducto;
