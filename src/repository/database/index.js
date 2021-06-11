const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("order-soft-db", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
});

exports.sequelize = sequelize;

const Carrito = require("../models/Carrito");
const CarritoProducto = require("../models/CarritoProducto");
const Categoria = require("../models/Categoria");
const Cliente = require("../models/Cliente");
const EstadoFactura = require("../models/EstadoFactura");
const EstadoProducto = require("../models/EstadoProducto");
const Factura = require("../models/Factura");
const FacturaProducto = require("../models/FacturaProducto");
const Ingrediente = require("../models/Ingrediente");
const IngredienteProducto = require("../models/IngredienteProducto");
const IngredienteProductoExtra = require("../models/IngredienteProductoExtra");
const Producto = require("../models/Producto");
const Rol = require("../models/Rol");
const Usuario = require("../models/Usuario");
const Valoracion = require("../models/Valoracion");

(async () => {
    await sequelize.sync();
    console.log("database connected");
})();

exports.models = {
    Carrito,
    CarritoProducto,
    Categoria,
    Cliente,
    EstadoFactura,
    EstadoProducto,
    Factura,
    FacturaProducto,
    Ingrediente,
    IngredienteProducto,
    IngredienteProductoExtra,
    Producto,
    Rol,
    Usuario,
    Valoracion,
};
