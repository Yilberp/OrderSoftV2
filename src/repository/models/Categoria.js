const { DataTypes, QueryTypes } = require("sequelize");
const { sequelize } = require("../database");

const Categoria = sequelize.define(
    "categorias",
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
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = Categoria;
