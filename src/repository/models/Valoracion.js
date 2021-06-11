const { DataTypes, QueryTypes } = require("sequelize");
const { sequelize } = require("../database");
const Usuario = require("./Usuario");
const Producto = require("./Producto");

const Valoracion = sequelize.define(
    "valoraciones",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_cliente: {
            type: DataTypes.INTEGER,
            references: {
                model: Usuario,
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
        calificacion: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
        },
        comentario: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = Valoracion;
