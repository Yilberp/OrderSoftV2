const { DataTypes, QueryTypes } = require("sequelize");
const { sequelize } = require("../database");
const Ingrediente = require("./Ingrediente");
const Producto = require("./Producto");

const IngredienteProducto = sequelize.define(
	"ingrediente_producto",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		id_producto: {
			type: DataTypes.INTEGER,
			references: {
				model: Producto,
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
		extra: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
);

module.exports = IngredienteProducto;
