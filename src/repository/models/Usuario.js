const bcrypt = require("bcrypt");
const { DataTypes, QueryTypes } = require("sequelize");
const { sequelize } = require("../database");
const Rol = require("./Rol");

const Usuario = sequelize.define(
	"usuarios",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		email: {
			type: DataTypes.STRING(60),
			allowNull: false,
			unique: true,
		},
		contrasena: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		id_rol: {
			type: DataTypes.INTEGER,
			references: {
				model: Rol,
				key: "id",
			},
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
);
Usuario.encryptPassword = (password) =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(10));
Usuario.prototype.comparePassword = function (contrasena) {
	return bcrypt.compareSync(contrasena, this.contrasena);
};

module.exports = Usuario;
