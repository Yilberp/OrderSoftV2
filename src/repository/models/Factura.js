const { DataTypes, QueryTypes } = require("sequelize");
const { sequelize } = require("../database");
const Cliente = require("./Cliente");
const EstadoFactura = require("./EstadoFactura");

const Factura = sequelize.define(
    "facturas",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_cliente: {
            type: DataTypes.INTEGER,
            references: {
                model: Cliente,
                key: "id",
            },
        },
        estadoFactura: {
            type: DataTypes.INTEGER,
            references: {
                model: EstadoFactura,
                key: "id",
            },
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        total: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

Factura.getCarrito = async (id_cliente) =>
    await sequelize.query(
        `SELECT x.id, x.id_factura, x.id_producto, x.imagen, x.nombre, x.cantidad, x.precio, COALESCE(x.adicionales,0) AS adicionales, (x.total+COALESCE(x.adicionales,0)) AS total
        FROM (SELECT fp.id AS id, fp.id_factura AS id_factura, fp.id_producto AS id_producto, p.imagen AS imagen, p.nombre AS nombre, fp.cantidad AS cantidad, fp.precio AS precio, 
        (SELECT SUM(i.precio) FROM ingrediente_producto_extra ipe JOIN ingredientes i ON ipe.id_ingrediente = i.id WHERE ipe.id_factura_producto = fp.id)*fp.cantidad AS adicionales,
        (fp.cantidad*fp.precio) AS total
        FROM factura_producto fp 
        JOIN productos p ON p.id = fp.id_producto 
        JOIN facturas f ON f.id = fp.id_factura
        WHERE f.id_cliente = ${id_cliente} AND f.estadoFactura = 2) AS x`,
        {
            type: QueryTypes.SELECT,
        }
    );

Factura.getProductoIds = async (id_cliente) =>
    await sequelize.query(
        `SELECT fp.id FROM facturas f JOIN factura_producto fp ON f.id = fp.id_factura WHERE f.id_cliente = ${id_cliente} AND f.estadoFactura = 2`,
        {
            type: QueryTypes.SELECT,
        }
    );

Factura.getFacturaProductoIds = async (id_cliente, id_producto) =>
    await sequelize.query(
        `SELECT fp.id FROM facturas f JOIN factura_producto fp ON f.id = fp.id_factura WHERE f.id_cliente = ${id_cliente} AND fp.id_producto = ${id_producto} AND f.estadoFactura = 2`,
        {
            type: QueryTypes.SELECT,
        }
    );

Factura.getIngredientesIds = async (id_factura_producto) =>
    await sequelize.query(
        `SELECT id_ingrediente FROM ingrediente_producto_extra WHERE id_factura_producto = ${id_factura_producto}`,
        {
            type: QueryTypes.SELECT,
        }
    );

module.exports = Factura;
