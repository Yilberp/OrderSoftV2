const { Op } = require("sequelize");
const CategoriaController = require("../controllers/CategoriaController");
const ValoracionController = require("../controllers/ValoracionController");
const Producto = require("../repository/models/Producto");
const IngredienteController = require("./IngredienteController");

module.exports = {
    aprobar: async (producto) => {
        const productoDB = await Producto.findByPk(producto.id);
        if (productoDB) {
            productoDB.id_estado = process.env.PRODUCTO_APROBADO;
            productoDB.save();
            return producto;
        }
        return false;
    },
    create: async (producto) => {
        const productoDB = await Producto.create({
            ...producto,
            id_estado: process.env.PRODUCTO_REVISION,
        });
        return productoDB ? productoDB : false;
    },
    delete: async (id) =>
        await Producto.destroy({
            where: {
                id,
                id_estado: process.env.PRODUCTO_REVISION,
            },
        }),
    getById: async (id) => await Producto.findByPk(id),
    getProductosRevision: async () =>
        await Producto.getProductosRevision(process.env.PRODUCTO_REVISION),
    getValoraciones: async (req, res) => {
        const { id, offset } = req.query;
        const valoraciones =
            await ValoracionController.getValoracionesByProducto(id, offset);
        res.json(valoraciones);
    },
    update: async (producto) => {
        const productoDB = await Producto.findByPk(producto.id);
        if (productoDB) {
            for (const field in producto) {
                productoDB[field] = producto[field];
            }
            return await productoDB.save();
        }
        return false;
    },
    viewProducto: async (req, res) => {
        const id = req.params.id;
        const categorias = await CategoriaController.getCategorias();
        const adicionales = await IngredienteController.getAdicionales();
        const total = await ValoracionController.getCount(id);
        const a = await ValoracionController.getCountCal1(id);
        const b = await ValoracionController.getCountCal2(id);
        const c = await ValoracionController.getCountCal3(id);
        const d = await ValoracionController.getCountCal4(id);
        const e = await ValoracionController.getCountCal5(id);
        const calificaciones = {
            A: { calificacion: a, porcentaje: ((a / total) * 100).toFixed() },
            B: { calificacion: b, porcentaje: ((b / total) * 100).toFixed() },
            C: { calificacion: c, porcentaje: ((c / total) * 100).toFixed() },
            D: { calificacion: d, porcentaje: ((d / total) * 100).toFixed() },
            E: { calificacion: e, porcentaje: ((e / total) * 100).toFixed() },
        };

        const producto = await Producto.findByPk(id);
        res.render("producto/ver-producto", {
            user: req.user,
            adicionales,
            categorias,
            producto,
            calificaciones,
        });
    },
    viewProductosByCategoria: async (req, res) => {
        const id_categoria = req.params.id;
        const categorias = await CategoriaController.getCategorias();
        const productos = await Producto.findAll({
            where: { id_estado: process.env.PRODUCTO_APROBADO, id_categoria },
        });
        const maxPrecio = await Producto.max("precio", {
            where: { id_estado: process.env.PRODUCTO_APROBADO, id_categoria },
        });
        const minPrecio = await Producto.min("precio", {
            where: { id_estado: process.env.PRODUCTO_APROBADO, id_categoria },
        });
        res.render("producto/lista-productos", {
            user: req.user,
            categorias,
            productos,
            maxPrecio,
            minPrecio,
        });
    },
    viewProductosBySearch: async (req, res) => {
        const { data } = req.query;
        const categorias = await CategoriaController.getCategorias();
        const productos = await Producto.findAll({
            where: {
                id_estado: process.env.PRODUCTO_APROBADO,
                [Op.or]: [
                    { nombre: { [Op.like]: `%${data}%` } },
                    { descripcion: { [Op.like]: `%${data}%` } },
                ],
            },
        });
        const maxPrecio = await Producto.max("precio", {
            where: {
                id_estado: process.env.PRODUCTO_APROBADO,
                [Op.or]: [
                    { nombre: { [Op.like]: `%${data}%` } },
                    { descripcion: { [Op.like]: `%${data}%` } },
                ],
            },
        });
        const minPrecio = await Producto.min("precio", {
            where: {
                id_estado: process.env.PRODUCTO_APROBADO,
                [Op.or]: [
                    { nombre: { [Op.like]: `%${data}%` } },
                    { descripcion: { [Op.like]: `%${data}%` } },
                ],
            },
        });
        res.render("producto/lista-productos", {
            user: req.user,
            categorias,
            productos,
            maxPrecio,
            minPrecio,
            data,
        });
    },
};
