const { DataTypes, QueryTypes } = require("sequelize");
const { sequelize } = require("../database");
const Categoria = require("./Categoria");
const EstadoProducto = require("./EstadoProducto");

const Producto = sequelize.define(
    "productos",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        imagen: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        nombre: {
            type: DataTypes.STRING(80),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING(300),
            allowNull: false,
        },
        id_categoria: {
            type: DataTypes.INTEGER,
            references: {
                model: Categoria,
                key: "id",
            },
        },
        precio: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        id_estado: {
            type: DataTypes.INTEGER,
            references: {
                model: EstadoProducto,
                key: "id",
            },
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

Producto.getProductosRevision = async (idEstado) =>
    await sequelize.query(
        `SELECT p.id, p.nombre, p.id_categoria, p.id_estado, p.precio, c.nombre as categoria, e.nombre as estado FROM productos p JOIN categorias c ON c.id = p.id_categoria JOIN estado_producto e ON e.id = p.id_estado WHERE p.id_estado = ${idEstado}`,
        {
            type: QueryTypes.SELECT,
        }
    );
module.exports = Producto;
