const { DataTypes, QueryTypes } = require("sequelize");
const { sequelize } = require("../database");
const Usuario = require("./Usuario");

const Cliente = sequelize.define(
	"clientes",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			references: {
				model: Usuario,
				key: "id",
			},
		},
		documento: {
			type: DataTypes.STRING(12),
			allowNull: false,
			unique: true,
		},
		nombres: {
			type: DataTypes.STRING(45),
			allowNull: false,
		},
		apellidos: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
		avatar: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		telefono: {
			type: DataTypes.STRING(10),
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

module.exports = Cliente;
